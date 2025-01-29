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

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/google/uuid"
)

var db *pgxpool.Pool
var app *gin.Engine
var s3Client *s3.Client

// Helper functions
func isValidImageType(mimeType string) bool {
	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/webp": true,
	}
	return allowedTypes[mimeType]
}

// func CloseDB() {
//     if db != nil {
//         db.Close()
//         fmt.Println("Database connection closed")
//     }
// }


func init() {
	gin.SetMode(gin.ReleaseMode)
	app = gin.New()
	r := app.Group("/api")
	myRouter(r)

	// Fetch DATABASE_URL from environment variables
	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		log.Fatalf("Missing database url variable: -> %v <- there", databaseUrl)
	}
	poolConfig, err := pgxpool.ParseConfig(databaseUrl)
    if err != nil {
        log.Fatalf("Error parsing database config: %v", err)
    }

    // Configure pool settings
    poolConfig.MaxConns = 25
    poolConfig.MinConns = 5

    // Assign to GLOBAL variable (use =, not :=)
    db, err = pgxpool.ConnectConfig(context.Background(), poolConfig)
    if err != nil {
        log.Fatalf("Unable to connect to database: %v", err)
    }

    // Verify connection
    err = db.Ping(context.Background())
    if err != nil {
        log.Fatalf("Database ping failed: %v", err)
    }

	// Load environment variables
	var aws_err error
	awsConfig, aws_err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(os.Getenv("AWS_REGION")),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			os.Getenv("AWS_ACCESS_KEY_ID"),
			os.Getenv("AWS_SECRET_ACCESS_KEY"),
			"",
		)),
	)
	if aws_err != nil {
		log.Fatal("AWS config error:", aws_err)
	}

	// Initialize S3 client
	s3Client = s3.NewFromConfig(awsConfig)
}

// Ping route for health checks
func ping(c *gin.Context) {
	var test string = os.Getenv("AWS_REGION")
	var test1 string = os.Getenv("AWS_ACCESS_KEY_ID")
	var test2 string = os.Getenv("S3_BUCKET")
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
		"aws_region": test,
		"satu": test1,
		"dua": test2,
	})
}

// User login function
func loginUser(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var hashedPassword string
	err := db.QueryRow(context.Background(), "SELECT password FROM users WHERE username = $1", input.Username).Scan(&hashedPassword)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			return
		}
		log.Fatalf("DB error msg: %v", err)
		fmt.Printf("DB error msg: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"username": input.Username,
	})
}

// Create a new user
func createUser(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Insert the user into the database
	_, err = db.Exec(context.Background(), "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", input.Username, input.Email, string(hashedPassword))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User created successfully",
	})
}

func uploadImage(c *gin.Context) {
    // Inisialisasi transaksi
    tx, err := db.Begin(context.Background())
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
        return
    }
    defer tx.Rollback(context.Background())

    // Proses upload file
    file, header, _ := c.Request.FormFile("image")
    defer file.Close()

	// Validate file type
	if !isValidImageType(header.Header.Get("Content-Type")) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image format. Only PNG/JPEG allowed"})
		return
	}

    // Generate S3 key
    ext := filepath.Ext(header.Filename)
    objectKey := fmt.Sprintf("images/%s%s", uuid.New().String(), ext)

    // Insert ke database DALAM TRANSAKSI
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
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
        return
    }

    // Upload ke S3
    _, err = s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
        Bucket: aws.String("myport-crunchy-personal"),
        Key:    aws.String(objectKey),
        Body:   file,
		ContentType: aws.String(header.Header.Get("Content-Type")),
		ACL:         types.ObjectCannedACLPrivate,
    })

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "S3 upload failed"})
        return
    }

    // Commit transaksi jika semua sukses
    if err := tx.Commit(context.Background()); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"id": imageID, "s3_key": objectKey, "message": "Image uploaded"})
}

func getOneImage(c *gin.Context) {
	id := c.Param("id")
	var image struct {
		ID          int    `json:"id"`
		S3Key       string `json:"s3_key"`
		Name        string `json:"name"`
		CategoryID  int    `json:"category_id"`
		Description string `json:"description"`
		Url 		string `json:"url"`
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

	// Generate pre-signed URL
	presignClient := s3.NewPresignClient(s3Client)
	presignedUrl, err := presignClient.PresignGetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String("myport-crunchy-personal"),
		Key:    aws.String(image.S3Key),
	}, s3.WithPresignExpires(15*time.Minute))
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "URL generation failed"})
		return
	}
	image.Url = presignedUrl.URL

	c.JSON(http.StatusOK, image)
}

func getAllImages(c *gin.Context) {
	rows, err := db.Query(context.Background(),
		`SELECT 
			i.id, 
			i.s3_key, 
			i.name, 
			c.name as category_name, 
			i.description 
		FROM images i
		JOIN categories c ON i.category_id = c.id
		WHERE i.s3_key LIKE 'images/%'`)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query database"})
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
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse data"})
			return
		}

		presignClient := s3.NewPresignClient(s3Client)
		presignedUrl, err := presignClient.PresignGetObject(context.TODO(), &s3.GetObjectInput{
			Bucket: aws.String("myport-crunchy-personal"),
			Key:    aws.String(s3Key),
		}, s3.WithPresignExpires(15*time.Minute))

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "URL generation failed for " + s3Key})
			return
		}

		images = append(images, gin.H{
			"id":          id,
			"name":        name,
			"s3_key":      s3Key,
			"category":    categoryName,
			"description": description,
			"url":         presignedUrl.URL,
		})
	}

	if len(images) == 0 {
		c.JSON(http.StatusOK, gin.H{"images": []interface{}{}})
		return
	}

	c.JSON(http.StatusOK, images)
}

func deleteImage(c *gin.Context) {
    // Mulai transaksi
    tx, err := db.Begin(context.Background())
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
        return
    }
    defer tx.Rollback(context.Background())

    imageID, _ := strconv.Atoi(c.Param("id"))
    
    // Ambil S3 key dengan row locking
    var s3Key string
    err = tx.QueryRow(context.Background(),
        "SELECT s3_key FROM images WHERE id = $1 FOR UPDATE", imageID,
    ).Scan(&s3Key)

    if err != nil {
        if err == pgx.ErrNoRows {
            c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
        }
        return
    }

    // Hapus dari database DALAM TRANSAKSI
    _, err = tx.Exec(context.Background(),
        "DELETE FROM images WHERE id = $1", imageID,
    )
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete record"})
        return
    }

    // Hapus dari S3
    _, err = s3Client.DeleteObject(context.TODO(), &s3.DeleteObjectInput{
        Bucket: aws.String("myport-crunchy-personal"),
        Key:    aws.String(s3Key),
    })
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "S3 delete failed"})
        return
    }

    // Commit transaksi
    if err := tx.Commit(context.Background()); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed"})
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

func myRouter(r *gin.RouterGroup) {
	// Routes
	r.GET("/ping", ping)

	// Images
	r.POST("/login", loginUser)
	r.POST("/create", createUser)
	r.POST("/imgupl", uploadImage)
	r.GET("/images", getAllImages)
	r.GET("/image/:id", getOneImage)
	r.DELETE("/imgdel/:id", deleteImage)
	r.PUT("/imgupd/:id", updateImage)

	// Route Categories
	r.GET("/categories", getCategories)
	r.POST("/categories", addCategory)
}

// Serve as a Vercel function
func Handler(w http.ResponseWriter, r *http.Request) {
	// defer CloseDB()
	app.ServeHTTP(w, r)
}
