# Kairo - Intelligent Note-Taking App

> Your intelligent note-taking companion with auto-reminders, graph visualization, and seamless linking

## 🌟 Features

### 📝 **Rich Note Editor**
- **Markdown Support**: Full GitHub Flavored Markdown with live preview
- **Auto-save**: Never lose your work with intelligent auto-saving
- **Syntax Highlighting**: Beautiful code block rendering
- **Keyboard Shortcuts**: Boost productivity with familiar shortcuts

### 🔗 **Intelligent Linking**
- **Bi-directional Links**: Connect notes using `[[Note Title]]` syntax
- **Graph View**: Visualize note connections with interactive D3.js graphs
- **Link Suggestions**: Smart suggestions as you type note titles

### 🔔 **Smart Reminders**
- **Auto-generated Reminders**: System creates review reminders automatically
  - 1 day review reminder
  - 1 week review reminder  
  - 1 month review reminder
- **Custom Reminders**: Set your own reminder dates and messages
- **Reminder Dashboard**: Manage all reminders in one place

### 🎨 **Obsidian-like UI**
- **Dark Mode**: Beautiful dark theme optimized for long writing sessions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Clean Interface**: Distraction-free writing environment

### 🔍 **Powerful Search**
- **Full-text Search**: Find content across all your notes instantly
- **Keyboard Navigation**: Navigate search results with arrow keys
- **Real-time Results**: See results as you type

### ⭐ **Organization**
- **Star Important Notes**: Mark notes as favorites
- **Recent Notes**: Quick access to recently edited notes
- **Note Statistics**: Track your writing progress

## 🚀 Quick Start

### Backend Setup (Spring Boot)

1. **Prerequisites**
   ```bash
   # Ensure you have Java 17+ and MySQL installed
   java -version  # Should show Java 17+
   mysql --version
   ```

2. **Database Setup**
   ```sql
   # Connect to MySQL
   mysql -u root -p
   
   # Create database
   CREATE DATABASE kairo;
   
   # Create user (optional, for production)
   CREATE USER 'kairo_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON kairo.* TO 'kairo_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Backend Configuration**
   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/kairo
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
   
   # JWT Configuration
   app.jwtExpirationInMs=86400000
   
   # CORS Configuration
   spring.web.cors.allowed-origins=http://localhost:3000
   spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
   spring.web.cors.allowed-headers=*
   spring.web.cors.allow-credentials=true
   ```

4. **Start Backend**
   ```bash
   # Navigate to backend directory
   cd heloog-kairo-c3b11cb03ddc
   
   # Run with Maven wrapper
   ./mvnw spring-boot:run
   
   # Or on Windows
   mvnw.cmd spring-boot:run
   
   # Backend will start on http://localhost:8080
   ```

### Frontend Setup (React + Vite)

1. **Prerequisites**
   ```bash
   # Ensure you have Node.js 18+ installed
   node --version  # Should show v18+
   npm --version
   ```

2. **Create Frontend Project**
   ```bash
   # Create frontend directory
   mkdir kairo-frontend
   cd kairo-frontend
   
   # Initialize with Vite
   npm create vite@latest . -- --template react
   
   # Answer the prompts:
   # ✔ Select a framework: › React
   # ✔ Select a variant: › JavaScript
   ```

3. **Install All Dependencies**
   ```bash
   # Install base dependencies from package.json first
   npm install
   
   # Install additional required dependencies
   npm install react-router-dom@^6.20.1 \
               axios@^1.6.2 \
               lucide-react@^0.294.0 \
               react-hot-toast@^2.4.1 \
               react-markdown@^9.0.1 \
               remark-gfm@^4.0.0 \
               d3@^7.8.5 \
               recharts@^2.8.0 \
               react-beautiful-dnd@^13.1.1 \
               date-fns@^2.30.0 \
               react-datepicker@^4.25.0 \
               @headlessui/react@^1.7.17
   
   # Install dev dependencies for styling
   npm install -D tailwindcss@^3.3.6 \
                  postcss@^8.4.32 \
                  autoprefixer@^10.4.16
   
   # Initialize Tailwind CSS
   npx tailwindcss init -p
   ```

4. **Copy Project Files**
   ```bash
   # You need to copy all the React component files I provided:
   # - Replace src/App.jsx with the App.jsx artifact
   # - Replace src/main.jsx with the main.jsx artifact  
   # - Replace src/index.css with the index.css artifact
   # - Add src/App.css from the App.css artifact
   # - Replace index.html with the index.html artifact
   # - Replace package.json with the package.json artifact
   # - Replace vite.config.js with the vite.config.js artifact
   # - Replace tailwind.config.js with the tailwind.config.js artifact
   
   # Create required directories
   mkdir -p src/components src/services
   
   # Copy component files to src/components/
   # Copy service files to src/services/
   ```

5. **Environment Setup**
   ```bash
   # Create .env file from example
   cp .env.example .env
   
   # Edit .env with your settings
   echo "VITE_API_URL=http://localhost:8080" > .env
   echo "VITE_APP_NAME=Kairo" >> .env
   echo "VITE_APP_VERSION=1.0.0" >> .env
   ```

6. **Start Frontend**
   ```bash
   # Install any remaining dependencies
   npm install
   
   # Start development server
   npm run dev
   
   # Frontend will start on http://localhost:3000
   ```

## 📁 Project Structure

```
kairo/
├── backend/                          # Spring Boot backend
│   ├── src/main/java/com/techm/
│   │   ├── config/                   # Security & CORS config
│   │   ├── controller/               # REST API endpoints
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── model/                    # JPA entities
│   │   ├── repository/               # Data access layer
│   │   ├── service/                  # Business logic
│   │   └── util/                     # JWT utilities
│   ├── src/main/resources/
│   │   └── application.properties    # App configuration
│   └── pom.xml                       # Maven dependencies
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── AuthModal.jsx         # Authentication
│   │   │   ├── Sidebar.jsx           # Navigation
│   │   │   ├── NoteEditor.jsx        # Markdown editor
│   │   │   ├── GraphView.jsx         # D3.js graph
│   │   │   ├── ReminderPanel.jsx     # Reminders
│   │   │   └── SearchModal.jsx       # Global search
│   │   ├── services/                 # API services
│   │   │   ├── authService.js        # Authentication API
│   │   │   ├── noteService.js        # Notes API
│   │   │   └── reminderService.js    # Reminders API
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # App entry point
│   │   ├── index.css                 # Global styles
│   │   └── App.css                   # Component styles
│   ├── public/                       # Static assets
│   ├── package.json                  # Dependencies
│   ├── vite.config.js                # Vite configuration
│   └── tailwind.config.js            # Tailwind setup
│
└── README.md                         # This file
```

## 🔧 API Endpoints

### Authentication
```http
POST /api/auth/signup      # Create new account
POST /api/auth/signin      # Login
POST /api/auth/validate    # Validate token
```

### Notes Management
```http
GET    /api/notes          # Get all notes
GET    /api/notes/{id}     # Get specific note
POST   /api/notes          # Create new note
PUT    /api/notes/{id}     # Update note
DELETE /api/notes/{id}     # Delete note
GET    /api/notes/starred  # Get starred notes
GET    /api/notes/search?q={query}  # Search notes
POST   /api/notes/{id}/star # Toggle star status
```

### Reminders Management
```http
GET    /api/reminders         # Get all reminders
GET    /api/reminders/{id}    # Get specific reminder
POST   /api/reminders         # Create reminder
PUT    /api/reminders/{id}    # Update reminder