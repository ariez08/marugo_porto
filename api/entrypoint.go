package api

import (
	"database/sql"
	"encoding/base64"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB
var app *gin.Engine

func init() {
	gin.SetMode(gin.ReleaseMode)
	app = gin.New()
	r := app.Group("/api")
	myRouter(r)

	// Fetch DATABASE_URL from environment variables
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}

	// Connect to the database
	var err error
	db, err = sql.Open("postgres", databaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
}

// Ping route for health checks
func ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "pong"})
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
	err := db.QueryRow("SELECT password FROM users WHERE username = $1", input.Username).Scan(&hashedPassword)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "username": input.Username})
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

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	_, err = db.Exec("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", input.Username, input.Email, hashedPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}

// Upload an image
func uploadImage(c *gin.Context) {
	file, _, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get image file"})
		return
	}
	defer file.Close()

	name := c.PostForm("name")
	description := c.PostForm("description")
	categoryID := c.PostForm("category_id")

	imageData, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read image file"})
		return
	}

	_, err = db.Exec("INSERT INTO images (name, category_id, description, image_data) VALUES ($1, $2, $3, $4)",
		name, categoryID, description, imageData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image to database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image uploaded successfully"})
}

// Fetch all images
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
		if err := rows.Scan(&id, &name, &categoryID, &description, &imageData); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan image data"})
			return
		}

		encodedImage := base64.StdEncoding.EncodeToString(imageData)
		images = append(images, gin.H{
			"id":          id,
			"name":        name,
			"category_id": categoryID.Int32,
			"description": description,
			"image":       "data:image/jpeg;base64," + encodedImage,
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

func myRouter(r *gin.RouterGroup) {
	// Routes
	r.GET("/ping", ping)

	// Images
	r.POST("/login", loginUser)
	r.POST("/create", createUser)
	r.POST("/upload", uploadImage)
	r.GET("/images", getImages)
	r.DELETE("/images/:id", deleteImage)

	// Route Categories
	r.GET("/categories", getCategories)
	r.POST("/categories", addCategory)
}

// Serve as a Vercel function
func Handler(w http.ResponseWriter, r *http.Request) {
	app.ServeHTTP(w, r)
}
