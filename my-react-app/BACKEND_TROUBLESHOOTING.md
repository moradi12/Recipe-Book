# 🚨 Backend Connection Troubleshooting

## Current Status: 404 Error on Recipe Endpoints

The frontend is getting 404 errors when trying to fetch recipes, which means either:
1. **Backend server is not running**
2. **Backend endpoints don't exist** 
3. **Wrong URL/port configuration**
4. **CORS issues**

## 🔍 **Step-by-Step Debugging**

### Step 1: Check if Backend is Running
Open a new terminal and check if anything is running on port 8080:

**Windows:**
```bash
netstat -ano | findstr :8080
```

**Mac/Linux:**
```bash
lsof -i :8080
```

If nothing shows up, the backend is **NOT running**.

### Step 2: Start Your Spring Boot Backend
Navigate to your Spring Boot project directory and run:

```bash
# Using Maven
mvn spring-boot:run

# Using Gradle
./gradlew bootRun

# Or if you have a JAR file
java -jar your-app.jar
```

### Step 3: Verify Backend Endpoints
Once the backend is running, test these URLs directly in your browser:

1. **Basic Health Check**: http://localhost:8080/actuator/health (if actuator is enabled)
2. **Recipes Endpoint**: http://localhost:8080/api/recipes
3. **Categories**: http://localhost:8080/api/categories
4. **Auth Endpoint**: http://localhost:8080/api/auth (might return 405 Method Not Allowed for GET, that's OK)

### Step 4: Test with Frontend Debug Tools
I've added test components to your React app. Look for:
- **Backend Test Component** at the top of the page
- **Login Test Component** below it

Click the test buttons and check the results.

## 🛠️ **Common Issues & Solutions**

### Issue 1: "Backend is not running"
**Solution**: Start your Spring Boot application
```bash
cd path/to/your/spring-boot-project
mvn spring-boot:run
```

### Issue 2: "Wrong port" 
**Check**: Your Spring Boot app might be running on a different port
- Look for logs like: `Tomcat started on port(s): 8080 (http)`
- If it's on a different port, update the frontend URLs

### Issue 3: "Endpoints don't exist"
**Check your Spring Boot controllers**:
```java
@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    
    @GetMapping
    public List<Recipe> getAllRecipes() {
        // Your implementation
    }
    
    @GetMapping("/categories") 
    public List<Category> getCategories() {
        // Your implementation
    }
}
```

### Issue 4: "CORS Issues"
Add CORS configuration to your Spring Boot app:
```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## 📝 **Expected Backend Endpoints**

Your Spring Boot app should have these endpoints:

### **Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### **Recipes:**
- `GET /api/recipes` - Get all recipes (paginated)
- `GET /api/recipes/{id}` - Get single recipe
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/{id}` - Update recipe
- `DELETE /api/recipes/{id}` - Delete recipe
- `GET /api/recipes/my` - Get current user's recipes
- `GET /api/recipes/search?title=...` - Search recipes

### **Categories:**
- `GET /api/recipes/categories` - Get all categories
- `GET /api/categories/food-categories` - Get food categories

### **Admin:**
- `GET /api/admin/recipes/pending` - Get pending recipes
- `PUT /api/admin/recipes/{id}/approve` - Approve recipe
- `PUT /api/admin/recipes/{id}/reject` - Reject recipe

## 🚀 **Quick Fix Commands**

1. **Check if backend is running:**
   ```bash
   curl http://localhost:8080/api/recipes
   ```

2. **Test auth endpoint:**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"usernameOrEmail":"test","password":"test"}'
   ```

3. **Check frontend-backend connection:**
   - Use the test components I added to your React app
   - Check browser Network tab for failed requests
   - Look at browser Console for detailed error logs

## 📞 **Next Steps**

1. **Start your Spring Boot backend** if it's not running
2. **Test the endpoints** using the debug components
3. **Check the browser console** for detailed error logs  
4. **Verify CORS configuration** if endpoints exist but still fail

Let me know what you find when you test these steps!