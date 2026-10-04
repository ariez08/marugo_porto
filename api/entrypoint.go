package api

import (
	"context"
	"log"
	"net/http"
	"os"
	"fmt"
	"path/filepath"
	"time"
	"strings"
	"strconv"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/jackc/pgx/v4"

	"github.com/google/uuid"

	"github.com/golang-jwt/jwt/v5"
)

var (
	app 		*gin.Engine
	db        	*pgxpool.Pool
	accessTokenKey []byte
	refreshTokenKey []byte
)

func loadDotEnv() {
	for _, filename := range []string{".env.local", ".env"} {
		data, err := os.ReadFile(filename)
		if err != nil {
			continue
		}
		for _, line := range strings.Split(string(data), "\n") {
			line = strings.TrimSpace(line)
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			parts := strings.SplitN(line, "=", 2)
			if len(parts) == 2 {
				key := strings.TrimSpace(parts[0])
				val := strings.Trim(strings.TrimSpace(parts[1]), `"'`)
				if os.Getenv(key) == "" {
					os.Setenv(key, val)
				}
			}
		}
	}
}

func resolveImageUrl(key string) string {
	if key == "" {
		return ""
	}
	if strings.HasPrefix(key, "http://") || strings.HasPrefix(key, "https://") {
		return key
	}
	clean := strings.TrimPrefix(key, "/")
	return "/" + clean
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Allow-Credentials", "true")
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Cookie")
		}
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusOK)
			return
		}
		c.Next()
	}
}

func ensureJwtKeys() {
	if len(accessTokenKey) == 0 {
		secret := os.Getenv("DIMAS_JWT_ACCESS_TOKEN")
		if secret == "" {
			secret = "marugo_access_secret_key_default_2026"
		}
		accessTokenKey = []byte(secret)
	}
	if len(refreshTokenKey) == 0 {
		secret := os.Getenv("DIMAS_JWT_REFRESH_TOKEN")
		if secret == "" {
			secret = "marugo_refresh_secret_key_default_2026"
		}
		refreshTokenKey = []byte(secret)
	}
}

type Claims struct {
    Username string `json:"username"`
    jwt.RegisteredClaims
}

// Helper functions
func isValidImageType(mimeType string) bool {
	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/webp": true,
	}
	return allowedTypes[mimeType]
}

func isValidUser(loginInput, password string) (bool, string) {
	cleanInput := strings.TrimSpace(loginInput)
	var actualUsername string
	var storedHash string

	err := db.QueryRow(context.Background(),
		"SELECT username, password FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1)",
		cleanInput,
	).Scan(&actualUsername, &storedHash)

	if err != nil {
		if err == pgx.ErrNoRows {
			log.Printf("[AUTH] Login failed: User/Email '%s' tidak ditemukan di database", cleanInput)
		} else {
			log.Printf("[AUTH] Login error query database: %v", err)
		}
		return false, ""
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(password))
	if err != nil {
		log.Printf("[AUTH] Login failed: Password salah untuk user '%s'", actualUsername)
		return false, ""
	}

	log.Printf("[AUTH] Login SUCCESS untuk user '%s'", actualUsername)
	return true, actualUsername
}

func GenerateAccessToken(username string) (string, error) {
    expirationTime := time.Now().Add(30 * time.Minute)
    claims := &Claims{
        Username: username,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(expirationTime),
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(accessTokenKey)
}

func GenerateRefreshToken(username string) (string, error) {
    expirationTime := time.Now().Add(7 * 24 * time.Hour)
    claims := &Claims{
        Username: username,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(expirationTime),
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(refreshTokenKey)
}

func MeHandler(c *gin.Context) {
    user, exists := c.Get("user") // Ambil dari JWT middleware
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"username": user})
}


func init() {
	loadDotEnv()
	ensureJwtKeys()

	gin.SetMode(gin.ReleaseMode)
	app = gin.New()
	_ = app.SetTrustedProxies(nil)
	app.Use(gin.Logger())
	app.Use(gin.Recovery())
	app.Use(corsMiddleware())

	// Serve static assets from public/images
	app.Static("/images", "./public/images")

	r := app.Group("/api")
	myRouter(r)
	rootR := app.Group("")
	myRouter(rootR)
	// Fetch DATABASE_URL from environment variables
	databaseUrl := os.Getenv("STORAGE_DATABASE_URL")
	if databaseUrl == "" {
		databaseUrl = os.Getenv("STORAGE_POSTGRES_URL")
	}
	if databaseUrl == "" {
		databaseUrl = os.Getenv("DATABASE_URL")
	}

	if databaseUrl == "" {
		log.Printf("Warning: no database URL configured in environment")
		return
	}

	poolConfig, err := pgxpool.ParseConfig(databaseUrl)
	if err != nil {
		log.Printf("Warning: error parsing database config: %v", err)
		return
	}

	poolConfig.MaxConns = 15
	poolConfig.MinConns = 2

	db, err = pgxpool.ConnectConfig(context.Background(), poolConfig)
	if err != nil {
		log.Printf("Warning: unable to connect to database: %v", err)
		return
	}

	err = db.Ping(context.Background())
	if err != nil {
		log.Printf("Warning: database ping failed: %v", err)
	} else {
		log.Printf("Database connection verified successfully")
	}
}

// Ping route for health checks
func ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
		"status":  "ready",
	})
}

// User login function
func LoginUserHandler(c *gin.Context) {
    type LoginRequest struct {
        Username string `json:"username" binding:"required"`
        Password string `json:"password" binding:"required"`
    }

    var creds LoginRequest
    if err := c.ShouldBindJSON(&creds); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    valid, actualUsername := isValidUser(creds.Username, creds.Password)
    if valid {
        accessToken, _ := GenerateAccessToken(actualUsername)
        refreshToken, _ := GenerateRefreshToken(actualUsername)

        c.SetCookie("access_token", accessToken, 1800, "/", "", false, true)
        c.SetCookie("refresh_token", refreshToken, 7*24*3600, "/refresh-token", "", false, true)

        c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
    } else {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
    }
}

// Create a new user
func createUserHandler(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
        Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	// Parse dan validasi body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if len(req.Username) < 3 || len(req.Password) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username/password terlalu pendek"})
		return
	}

	// Cek apakah username sudah ada
	var exists bool
	err := db.QueryRow(context.Background(),
		"SELECT EXISTS (SELECT 1 FROM users WHERE username = $1 or email = $2)",
		req.Username, req.Email,
	).Scan(&exists)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if exists {
		c.JSON(http.StatusConflict, gin.H{"error": "Username atau Email sudah terdaftar"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal hash password"})
		return
	}

	// Simpan user ke database
	_, err = db.Exec(context.Background(),
		"INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
		req.Username, req.Email, string(hashedPassword),
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat akun"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User berhasil dibuat"})
}
func listUsersHandler(c *gin.Context) {
	rows, err := db.Query(context.Background(),
		"SELECT id, username, email, COALESCE(TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS'), '') FROM users ORDER BY id ASC",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	defer rows.Close()

	type UserResponse struct {
		ID        int    `json:"id"`
		Username  string `json:"username"`
		Email     string `json:"email"`
		CreatedAt string `json:"created_at"`
	}

	var userList []UserResponse
	for rows.Next() {
		var u UserResponse
		if err := rows.Scan(&u.ID, &u.Username, &u.Email, &u.CreatedAt); err != nil {
			continue
		}
		userList = append(userList, u)
	}

	if userList == nil {
		userList = []UserResponse{}
	}

	c.JSON(http.StatusOK, userList)
}

func deleteUserHandler(c *gin.Context) {
	idStr := c.Param("id")
	targetID, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	currentUsername := c.MustGet("username").(string)

	var targetUsername string
	err = db.QueryRow(context.Background(), "SELECT username FROM users WHERE id = $1", targetID).Scan(&targetUsername)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if targetUsername == currentUsername {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tidak dapat menghapus akun yang sedang aktif digunakan"})
		return
	}

	var count int
	err = db.QueryRow(context.Background(), "SELECT COUNT(*) FROM users").Scan(&count)
	if err == nil && count <= 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tidak dapat menghapus satu-satunya user tersisa"})
		return
	}

	_, err = db.Exec(context.Background(), "DELETE FROM users WHERE id = $1", targetID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User berhasil dihapus"})
}

func updateUserHandler(c *gin.Context) {
	idStr := c.Param("id")
	targetID, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if req.Email == "" && req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Minimal email atau password harus diisi"})
		return
	}

	if req.Password != "" {
		if len(req.Password) < 6 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Password minimal 6 karakter"})
			return
		}
		hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal hash password"})
			return
		}
		if req.Email != "" {
			_, err = db.Exec(context.Background(), "UPDATE users SET email = $1, password = $2, updated_at = NOW() WHERE id = $3", req.Email, string(hashed), targetID)
		} else {
			_, err = db.Exec(context.Background(), "UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2", string(hashed), targetID)
		}
	} else {
		_, err = db.Exec(context.Background(), "UPDATE users SET email = $1, updated_at = NOW() WHERE id = $2", req.Email, targetID)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User berhasil diperbarui"})
}


func AuthGinMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        cookie, err := c.Request.Cookie("access_token")
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
            return
        }

        claims := &Claims{}
        token, err := jwt.ParseWithClaims(cookie.Value, claims, func(token *jwt.Token) (interface{}, error) {
            return accessTokenKey, nil
        })

        if err != nil || !token.Valid {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            return
        }

        // Simpan ke context Gin
        c.Set("username", claims.Username)
        c.Next()
    }
}

func RefreshTokenHandlerGin(c *gin.Context) {
    cookie, err := c.Request.Cookie("refresh_token")
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "No refresh token"})
        return
    }

    claims := &Claims{}
    token, err := jwt.ParseWithClaims(cookie.Value, claims, func(token *jwt.Token) (interface{}, error) {
        return refreshTokenKey, nil
    })

    if err != nil || !token.Valid {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
        return
    }

    newAccessToken, _ := GenerateAccessToken(claims.Username)

    http.SetCookie(c.Writer, &http.Cookie{
        Name:     "access_token",
        Value:    newAccessToken,
        HttpOnly: true,
        Path:     "/",
        MaxAge:   1800,
    })

    c.JSON(http.StatusOK, gin.H{"message": "Access token refreshed"})
}

func LogoutHandlerGin(c *gin.Context) {
    // Overwrite dengan expired cookies
    c.SetCookie("access_token", "", -1, "/", "", true, true)
    c.SetCookie("refresh_token", "", -1, "/refresh-token", "", true, true)

    c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

func uploadImage(c *gin.Context) {
	if db == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database connection is not available"})
		return
	}

	tx, err := db.Begin(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction: " + err.Error()})
		return
	}
	defer tx.Rollback(context.Background())

	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File image is required"})
		return
	}
	defer file.Close()

	if !isValidImageType(header.Header.Get("Content-Type")) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image format. Only PNG/JPEG/WEBP allowed"})
		return
	}

	ext := strings.ToLower(filepath.Ext(header.Filename))
	if ext == "" {
		ext = ".png"
	}
	fileName := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	objectKey := fmt.Sprintf("images/%s", fileName)

	// Save to local project directory: public/images/
	uploadDir := filepath.Join("public", "images")
	_ = os.MkdirAll(uploadDir, 0755)
	destPath := filepath.Join(uploadDir, fileName)
	if err := c.SaveUploadedFile(header, destPath); err != nil {
		tmpDir := filepath.Join(os.TempDir(), "images")
		_ = os.MkdirAll(tmpDir, 0755)
		_ = c.SaveUploadedFile(header, filepath.Join(tmpDir, fileName))
	}

	var imageID int
	err = tx.QueryRow(context.Background(),
		`INSERT INTO images (name, category_id, description, s3_key)
		VALUES ($1, $2, $3, $4) RETURNING id`,
		c.PostForm("name"),
		c.PostForm("category_id"),
		c.PostForm("description"),
		objectKey,
	).Scan(&imageID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		return
	}

	if err := tx.Commit(context.Background()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":      imageID,
		"s3_key":  objectKey,
		"url":     resolveImageUrl(objectKey),
		"message": "Image uploaded successfully",
	})
}

func getOneImage(c *gin.Context) {
	if db == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database connection is not available"})
		return
	}

	id := c.Param("id")
	var image struct {
		ID          int    `json:"id"`
		S3Key       string `json:"s3_key"`
		Name        string `json:"name"`
		CategoryID  int    `json:"category_id"`
		Description string `json:"description"`
		Url         string `json:"url"`
	}

	err := db.QueryRow(context.Background(),
		`SELECT id, s3_key, name, category_id, description
		FROM images
		WHERE id = $1`, id,
	).Scan(&image.ID, &image.S3Key, &image.Name, &image.CategoryID, &image.Description)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}

	image.Url = resolveImageUrl(image.S3Key)
	c.JSON(http.StatusOK, image)
}

func getAllImages(c *gin.Context) {
	if db == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database connection is not available"})
		return
	}

	rows, err := db.Query(context.Background(),
		`SELECT
			i.id,
			i.s3_key,
			i.name,
			c.name as category_name,
			i.description
		FROM images i
		JOIN categories c ON i.category_id = c.id`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query database: " + err.Error()})
		return
	}
	defer rows.Close()

	var images []gin.H

	for rows.Next() {
		var (
			id           int
			s3Key, name  string
			categoryName string
			description  string
		)

		if err := rows.Scan(&id, &s3Key, &name, &categoryName, &description); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse data: " + err.Error()})
			return
		}

		images = append(images, gin.H{
			"id":          id,
			"name":        name,
			"s3_key":      s3Key,
			"category":    categoryName,
			"description": description,
			"url":         resolveImageUrl(s3Key),
		})
	}

	if images == nil {
		images = []gin.H{}
	}

	c.JSON(http.StatusOK, images)
}

func deleteImage(c *gin.Context) {
	if db == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database connection is not available"})
		return
	}

	tx, err := db.Begin(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction: " + err.Error()})
		return
	}
	defer tx.Rollback(context.Background())

	imageID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image ID"})
		return
	}

	var s3Key string
	err = tx.QueryRow(context.Background(),
		"SELECT s3_key FROM images WHERE id = $1 FOR UPDATE", imageID,
	).Scan(&s3Key)

	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		}
		return
	}

	_, err = tx.Exec(context.Background(),
		"DELETE FROM images WHERE id = $1", imageID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete record: " + err.Error()})
		return
	}

	// Delete local file if present
	cleanPath := strings.TrimPrefix(s3Key, "/")
	localPath := filepath.Join("public", cleanPath)
	_ = os.Remove(localPath)

	if err := tx.Commit(context.Background()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}

func updateImage(c *gin.Context) {
    // Mulai transaksi
    tx, err := db.Begin(context.Background())
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
        return
    }
    defer tx.Rollback(context.Background())

    // Validasi ID
    imageID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image ID"})
        return
    }

    // Ambil data dari form
    name := c.PostForm("name")
    categoryIDStr := c.PostForm("category_id")
    description := c.PostForm("description")

    // Validasi minimal ada satu field yang diupdate
    if name == "" && categoryIDStr == "" && description == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "At least one field must be provided for update"})
        return
    }

    // Check if image exists and lock row
    var currentS3Key string
    err = tx.QueryRow(context.Background(),
        "SELECT s3_key FROM images WHERE id = $1 FOR UPDATE", imageID,
    ).Scan(&currentS3Key)

    if err != nil {
        if err == pgx.ErrNoRows {
            c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
        }
        return
    }

    // Build dynamic update query
    query := "UPDATE images SET"
    params := []interface{}{}
    paramCount := 1

    if name != "" {
        query += fmt.Sprintf(" name = $%d,", paramCount)
        params = append(params, name)
        paramCount++
    }

    if categoryIDStr != "" {
        categoryID, err := strconv.Atoi(categoryIDStr)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
            return
        }
        query += fmt.Sprintf(" category_id = $%d,", paramCount)
        params = append(params, categoryID)
        paramCount++
    }

    if description != "" {
        query += fmt.Sprintf(" description = $%d,", paramCount)
        params = append(params, description)
        paramCount++
    }

    // Hapus koma terakhir dan tambahkan WHERE clause
    query = strings.TrimSuffix(query, ",") + " WHERE id = $" + strconv.Itoa(paramCount)
    params = append(params, imageID)

    // Eksekusi update
    result, err := tx.Exec(context.Background(), query, params...)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed", "detail": err.Error()})
        return
    }

    // Cek jika ada row yang terupdate
    rowsAffected := result.RowsAffected()
    if rowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "No changes made or image not found"})
        return
    }

    // Commit transaksi
    if err := tx.Commit(context.Background()); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed"})
        return
    }

    // Ambil data terbaru untuk response
    var updatedImage struct {
        ID          int    `json:"id"`
        Name        string `json:"name"`
        CategoryID  int    `json:"category_id"`
        Description string `json:"description"`
        S3Key       string `json:"s3_key"`
        Url         string `json:"url"`
    }
    
    err = db.QueryRow(context.Background(),
        "SELECT id, name, category_id, description, s3_key FROM images WHERE id = $1",
        imageID,
    ).Scan(&updatedImage.ID, &updatedImage.Name, &updatedImage.CategoryID, 
         &updatedImage.Description, &updatedImage.S3Key)

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch updated data"})
        return
    }
    updatedImage.Url = resolveImageUrl(updatedImage.S3Key)
    c.JSON(http.StatusOK, updatedImage)
}

func getCategories(c *gin.Context) {
	rows, err := db.Query(context.Background(), "SELECT id, name FROM categories")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve categories"})
		return
	}
	defer rows.Close()

	var categories []gin.H

	for rows.Next() {
		var id int
		var name string
		err := rows.Scan(&id, &name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan category data"})
			return
		}

		categories = append(categories, gin.H{
			"id":   id,
			"name": name,
		})
	}

	c.JSON(http.StatusOK, categories)
}

func addCategory(c *gin.Context) {
	var input struct {
		Name string `json:"name" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	_, err := db.Exec(context.Background(), "INSERT INTO categories (name) VALUES ($1)", input.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category added successfully"})
}
func getCarouselItems(c *gin.Context) {
	query := `
		SELECT 
			ci.id,
			COALESCE(m.s3_key, ''),
			COALESCE(l.s3_key, ''),
			COALESCE(r.s3_key, ''),
			COALESCE(cat.name, 'Illustration'),
			COALESCE(ci.description, ''),
			COALESCE(ci.alt_text, '')
		FROM carousel_items ci
		LEFT JOIN images m ON ci.main_img = m.id
		LEFT JOIN images l ON ci.left_img = l.id
		LEFT JOIN images r ON ci.right_img = r.id
		LEFT JOIN categories cat ON ci.category_id = cat.id
		WHERE ci.is_active = true
		ORDER BY ci.id ASC
	`
	rows, err := db.Query(context.Background(), query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch carousel items"})
		return
	}
	defer rows.Close()

	type CarouselResp struct {
		ID          int    `json:"id"`
		MainUrl     string `json:"main_url"`
		LeftUrl     string `json:"left_url"`
		RightUrl    string `json:"right_url"`
		Category    string `json:"category"`
		Description string `json:"description"`
		AltText     string `json:"alt_text"`
	}

	var list []CarouselResp
	for rows.Next() {
		var item CarouselResp
		var mainKey, leftKey, rightKey string
		if err := rows.Scan(&item.ID, &mainKey, &leftKey, &rightKey, &item.Category, &item.Description, &item.AltText); err != nil {
			continue
		}
		item.MainUrl = resolveImageUrl(mainKey)
		item.LeftUrl = resolveImageUrl(leftKey)
		item.RightUrl = resolveImageUrl(rightKey)
		list = append(list, item)
	}

	if list == nil {
		list = []CarouselResp{}
	}

	c.JSON(http.StatusOK, list)
}


func myRouter(r *gin.RouterGroup) {
	// Public routes
	r.GET("/pingthefuckoutofme", ping)
	r.POST("/login", LoginUserHandler)
	r.POST("/logout", LogoutHandlerGin)
	// Public reads for portfolio visitors
	r.GET("/categories", getCategories)
	r.GET("/images", getAllImages)
	r.GET("/image/:id", getOneImage)
	r.GET("/carousel", getCarouselItems)

	// Protected routes requiring authentication
	auth := r.Group("", AuthGinMiddleware())
	{
		auth.GET("/me", func(c *gin.Context) {
			username := c.MustGet("username").(string)
			c.JSON(http.StatusOK, gin.H{"username": username})
		})
		auth.GET("/users", listUsersHandler)
		auth.POST("/users", createUserHandler)
		auth.PUT("/users/:id", updateUserHandler)
		auth.DELETE("/users/:id", deleteUserHandler)
		auth.POST("/categories", addCategory)
		auth.POST("/imgupl", uploadImage)
		auth.DELETE("/imgdel/:id", deleteImage)
		auth.PUT("/imgupd/:id", updateImage)
	}
}

// Serve as a Vercel function
func Handler(w http.ResponseWriter, r *http.Request) {
	// defer CloseDB()
	app.ServeHTTP(w, r)
}
