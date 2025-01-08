package main

import (
	"database/sql"
	"encoding/base64"
	"io"
	"log"
	"net/http"
	
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

func init() {
	var err error
	db, err = sql.Open("postgres", "user=postgres password=Kuli908 dbname=postgres host=localhost sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
}

func ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

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
	err := db.QueryRow("SELECT password FROM users WHERE username = $1", input.Username).Scan(&hashedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			return
		}
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
	_, err = db.Exec("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", input.Username, input.Email, string(hashedPassword))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User created successfully",
	})
}


func uploadImage(c *gin.Context) {
	file, _, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get image file"})
		return
	}
	name := c.PostForm("name")
	description := c.PostForm("description")
	categoryID := c.PostForm("category_id")
	defer file.Close()

	// Baca file ke dalam buffer
	imageData, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read image file"})
		return
	}

	// Simpan ke database
	_, err = db.Exec(
		"INSERT INTO images (name, category_id, description, image_data) VALUES ($1, $2, $3, $4)",
		name, categoryID, description, imageData,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image to database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image uploaded successfully"})
}

func getImage(c *gin.Context) {
	id := c.Param("id")

	var name, description string
	var categoryID sql.NullInt32
	var imageData []byte
	err := db.QueryRow(
		"SELECT name, category_id, description, image_data FROM images WHERE id = $1",
		id,
	).Scan(&name, &categoryID, &description, &imageData)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}

	c.Header("Content-Type", "image/jpeg") // Atur sesuai jenis file
	c.Header("Content-Disposition", "inline; filename="+name)
	c.Writer.Write(imageData)
}

// Semua gambar
func getImages(c *gin.Context) {
	rows, err := db.Query("SELECT id, name, category_id, description, image_data FROM images")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve images"})
		return
	}
	defer rows.Close()

	var images []gin.H

	for rows.Next() {
		var id int
		var name, description string
		var categoryID sql.NullInt32
		var imageData []byte
		err := rows.Scan(&id, &name, &categoryID, &description, &imageData)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan image data"})
			return
		}

		// Encode image data ke Base64
		encodedImage := base64.StdEncoding.EncodeToString(imageData)

		images = append(images, gin.H{
			"id":          id,
			"name":        name,
			"category_id": categoryID.Int32,
			"description": description,
			"image":       "data:image/jpeg;base64," + encodedImage, // Bisa diubah jika format lain
		})
	}

	c.JSON(http.StatusOK, images)
}

func deleteImage(c *gin.Context) {
	id := c.Param("id")

	// Hapus dari database
	_, err := db.Exec("DELETE FROM images WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image from database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}

func getCategories(c *gin.Context) {
	rows, err := db.Query("SELECT id, name FROM categories")
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

	_, err := db.Exec("INSERT INTO categories (name) VALUES ($1)", input.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category added successfully"})
}

func main() {
	r := gin.Default()

	// Konfigurasi CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	r.OPTIONS("/*path", func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Status(http.StatusOK)
	})	

	r.GET("/ping", ping)
	
	// Route User
	r.POST("/login", loginUser)
	r.POST("/create", createUser)

	// Route Image
	r.POST("/upload", uploadImage)
	r.GET("/image/:id", getImage)
	r.GET("/images", getImages)
	r.DELETE("/images/:id", deleteImage)

	// Route Categories
	r.GET("/categories", getCategories)
	r.POST("/categories", addCategory)

	// Menjalankan server di port 8080
	r.Run(":8080")
}
