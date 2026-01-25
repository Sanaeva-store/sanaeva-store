# Frequently Used Commands

A collection of commonly used commands for development, debugging, and system management.

## Table of Contents
- [Port Management](#port-management)
- [Process Management](#process-management)
- [Docker Commands](#docker-commands)
- [Prisma Commands](#prisma-commands)
- [Git Commands](#git-commands)
- [Search Commands (grep, find)](#search-commands-grep-find)
- [File Operations](#file-operations)
- [Network & Debugging](#network--debugging)
- [Package Management (bun)](#package-management-bun)

---

## Port Management

### Find process using a specific port
```bash
# macOS/Linux
lsof -i :3000

# Alternative - find PID
lsof -ti :3000

# Windows
netstat -ano | findstr :3000
```

### Kill process on a specific port
```bash
# macOS/Linux - Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or manually
kill -9 $(lsof -ti :3000)

# Multiple ports
lsof -ti:3000,3001 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Check if port is available
```bash
# Try to connect to port
nc -zv localhost 3000

# List all listening ports
lsof -iTCP -sTCP:LISTEN -P -n
```

---

## Process Management

### Find running processes
```bash
# Find by name
ps aux | grep node
ps aux | grep next

# Find with pattern
pgrep -f "next dev"

# Show full command
ps -ef | grep node
```

### Kill processes
```bash
# Kill by PID
kill -9 <PID>

# Kill by name pattern
pkill -f "next dev"
pkill -9 node

# Kill all Node processes
killall node

# Force kill with timeout
timeout 5 kill <PID> || kill -9 <PID>
```

### Monitor processes
```bash
# Real-time process monitoring
top
htop  # If installed

# Filter by command
top | grep node

# Show process tree
pstree -p
```

---

## Docker Commands

### Container Management
```bash
# List all containers
docker ps -a

# List running containers only
docker ps

# Start container
docker start <container_name>
docker start sanaeva-postgres

# Stop container
docker stop <container_name>
docker stop sanaeva-postgres

# Restart container
docker restart <container_name>

# Remove container
docker rm <container_name>
docker rm -f <container_name>  # Force remove

# View container logs
docker logs <container_name>
docker logs -f <container_name>  # Follow logs
docker logs --tail 100 <container_name>  # Last 100 lines
```

### Docker Compose
```bash
# Start services
cd infra
docker-compose -f docker-compose.dev.yml up -d

# Start specific service
docker-compose -f docker-compose.dev.yml up -d postgres

# Stop services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes
docker-compose -f docker-compose.dev.yml down -v

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Rebuild and start
docker-compose -f docker-compose.dev.yml up -d --build

# Check status
docker-compose -f docker-compose.dev.yml ps
```

### Docker Cleanup
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune
docker image prune -a  # Remove all unused images

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune
docker system prune -a --volumes  # Including volumes

# Check disk usage
docker system df
```

---

## Prisma Commands

### Schema Management
```bash
# Generate Prisma Client
bunx prisma generate

# Format schema file
bunx prisma format

# Validate schema
bunx prisma validate
```

### Database Migrations
```bash
# Create and apply migration (development)
bunx prisma migrate dev
bunx prisma migrate dev --name <migration_name>

# Apply migrations (production)
bunx prisma migrate deploy

# Check migration status
bunx prisma migrate status

# Reset database (⚠️ DESTRUCTIVE - dev only)
bunx prisma migrate reset

# Create migration without applying
bunx prisma migrate dev --create-only
```

### Database Operations
```bash
# Seed database
bunx prisma db seed

# Execute SQL query
bunx prisma db execute --stdin <<< "SELECT * FROM \"User\" LIMIT 5;"

# Push schema without migration (dev/prototype)
bunx prisma db push

# Pull schema from database
bunx prisma db pull
```

### Prisma Studio
```bash
# Open Prisma Studio (GUI)
bunx prisma studio

# Open on specific port
bunx prisma studio --port 5555
```

### Troubleshooting
```bash
# Check database connection
bunx prisma db execute --stdin <<< "SELECT 1;"

# View generated client location
cat prisma/schema.prisma | grep output

# Regenerate client after schema changes
bunx prisma generate --force
```

---

## Git Commands

### Status & Logs
```bash
# Check status
git status

# View commit history
git log
git log --oneline
git log --oneline --graph --all

# Show changes
git diff
git diff --staged
git diff HEAD~1  # Compare with previous commit
```

### Branch Management
```bash
# List branches
git branch
git branch -a  # Include remote branches

# Create new branch
git branch <branch_name>
git checkout -b <branch_name>

# Switch branch
git checkout <branch_name>
git switch <branch_name>

# Delete branch
git branch -d <branch_name>
git branch -D <branch_name>  # Force delete

# Rename branch
git branch -m <old_name> <new_name>
```

### Staging & Committing
```bash
# Stage files
git add .
git add <file_path>
git add -p  # Interactive staging

# Commit
git commit -m "message"
git commit -am "message"  # Stage and commit

# Amend last commit
git commit --amend
git commit --amend --no-edit
```

### Remote Operations
```bash
# Push changes
git push
git push origin <branch_name>
git push -u origin <branch_name>  # Set upstream

# Pull changes
git pull
git pull --rebase

# Fetch updates
git fetch
git fetch --all
```

### Undo Changes
```bash
# Discard working directory changes
git restore <file>
git checkout -- <file>

# Unstage file
git restore --staged <file>
git reset HEAD <file>

# Reset to previous commit
git reset --soft HEAD~1  # Keep changes staged
git reset --hard HEAD~1  # Discard all changes

# Revert commit
git revert <commit_hash>
```

---

## Search Commands (grep, find)

### grep - Search in Files
```bash
# Basic search
grep "search_term" file.txt

# Search in all files
grep -r "search_term" .

# Case-insensitive search
grep -i "search_term" file.txt

# Show line numbers
grep -n "search_term" file.txt

# Search with context
grep -A 3 "search_term" file.txt  # 3 lines after
grep -B 3 "search_term" file.txt  # 3 lines before
grep -C 3 "search_term" file.txt  # 3 lines before and after

# Search for whole word
grep -w "word" file.txt

# Exclude pattern
grep -v "exclude_this" file.txt

# Count matches
grep -c "search_term" file.txt

# Search in specific file types
grep -r --include="*.ts" "search_term" .
grep -r --include="*.{ts,tsx}" "search_term" .

# Exclude directories
grep -r --exclude-dir=node_modules "search_term" .
grep -r --exclude-dir={node_modules,.next,dist} "search_term" .

# Multiple patterns (OR)
grep -E "pattern1|pattern2" file.txt

# Regular expressions
grep -E "^import.*from" file.ts  # Lines starting with import
grep -P "\d{3}-\d{3}-\d{4}" file.txt  # Phone numbers
```

### find - Find Files
```bash
# Find by name
find . -name "*.ts"
find . -name "package.json"

# Case-insensitive name search
find . -iname "*.TS"

# Find directories
find . -type d -name "node_modules"

# Find files
find . -type f -name "*.log"

# Find and delete
find . -name "*.log" -delete
find . -name ".DS_Store" -delete

# Find by size
find . -size +100M  # Larger than 100MB
find . -size -1M    # Smaller than 1MB

# Find by modification time
find . -mtime -7    # Modified in last 7 days
find . -mtime +30   # Modified more than 30 days ago

# Find and execute command
find . -name "*.ts" -exec grep -l "import" {} \;

# Exclude directories
find . -path ./node_modules -prune -o -name "*.ts" -print

# Find empty files or directories
find . -empty

# Combine with xargs
find . -name "*.log" | xargs rm
find . -name "*.ts" | xargs wc -l
```

### Advanced Search Combinations
```bash
# Find TypeScript files with specific content
find . -name "*.ts" -exec grep -l "PrismaClient" {} \;

# Count lines of code
find . -name "*.ts" -not -path "*/node_modules/*" | xargs wc -l

# Find large node_modules
find . -type d -name "node_modules" -exec du -sh {} \;

# Find and replace in files
find . -name "*.ts" -exec sed -i '' 's/old/new/g' {} \;

# List files modified today
find . -type f -newermt "2026-01-25"
```

---

## File Operations

### Viewing Files
```bash
# View entire file
cat file.txt

# View with line numbers
cat -n file.txt

# View first 10 lines
head file.txt
head -20 file.txt  # First 20 lines

# View last 10 lines
tail file.txt
tail -50 file.txt  # Last 50 lines

# Follow file updates (logs)
tail -f file.log

# View large files with pagination
less file.txt
more file.txt
```

### File Information
```bash
# File size and info
ls -lh file.txt

# Disk usage
du -sh directory/
du -h --max-depth=1

# Count lines/words/characters
wc file.txt
wc -l file.txt  # Lines only

# File type
file file.txt
```

### File Operations
```bash
# Copy files
cp source.txt destination.txt
cp -r source_dir/ dest_dir/  # Recursive
cp -p file.txt backup.txt    # Preserve attributes

# Move/Rename
mv old_name.txt new_name.txt
mv file.txt directory/

# Delete files
rm file.txt
rm -rf directory/  # Recursive force delete
rm -i file.txt     # Interactive (confirm)

# Create directory
mkdir directory_name
mkdir -p path/to/nested/directory

# Create empty file or update timestamp
touch file.txt
```

### Permission Management
```bash
# View permissions
ls -la

# Change permissions
chmod 644 file.txt
chmod +x script.sh
chmod -R 755 directory/

# Change ownership
chown user:group file.txt
sudo chown -R user:group directory/
```

---

## Network & Debugging

### HTTP Requests (curl)
```bash
# GET request
curl http://localhost:3000

# POST request with JSON
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# With authentication
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/v1/user

# Save response to file
curl http://localhost:3000 -o response.json

# Follow redirects
curl -L http://localhost:3000

# Show response headers
curl -i http://localhost:3000
curl -I http://localhost:3000  # HEAD request

# Verbose output
curl -v http://localhost:3000

# Multiple requests
curl http://localhost:3000/api/user/{1,2,3}
```

### Network Testing
```bash
# Test connection to host:port
nc -zv localhost 3000
telnet localhost 3000

# Ping host
ping localhost
ping -c 4 google.com  # 4 packets only

# Check DNS
nslookup example.com
dig example.com

# Show network connections
netstat -an | grep LISTEN
ss -tulpn  # Linux

# Trace route
traceroute example.com
```

### System Information
```bash
# Check system resources
df -h        # Disk space
free -h      # Memory (Linux)
top          # CPU/Memory usage

# macOS specific
diskutil list
system_profiler SPSoftwareDataType
```

---

## Package Management (bun)

### Installation
```bash
# Install all dependencies
bun install

# Install specific package
bun add <package>
bun add -d <package>  # Dev dependency

# Install specific version
bun add <package>@<version>

# Force reinstall
bun install --force

# Clean install
rm -rf node_modules bun.lockb
bun install
```

### Running Scripts
```bash
# Run package.json scripts
bun run dev
bun run build
bun run start

# Run TypeScript file directly
bun run file.ts
bunx tsx file.ts

# Run command from package
bunx prisma generate
bunx eslint .
```

### Package Information
```bash
# List installed packages
bun pm ls

# Check outdated packages
bun outdated

# Show package info
bun info <package>
```

### Troubleshooting
```bash
# Clear bun cache
bun pm cache rm

# Verify installation
bun --version
which bun

# Check for issues
bun check
```

---

## Quick Reference Cheatsheet

### Development Workflow
```bash
# Start development
docker-compose -f infra/docker-compose.dev.yml up -d postgres
bun install
bunx prisma generate
bunx prisma migrate dev
bunx prisma db seed
bun run dev

# Stop everything
lsof -ti:3000 | xargs kill -9
docker-compose -f infra/docker-compose.dev.yml down
```

### Common Issues

#### Port already in use
```bash
lsof -ti:3000 | xargs kill -9
```

#### Database connection issues
```bash
# Check if Postgres is running
docker ps | grep postgres

# Start Postgres
cd infra && docker-compose -f docker-compose.dev.yml up -d postgres

# Test connection
bunx prisma db execute --stdin <<< "SELECT 1;"
```

#### Prisma Client out of sync
```bash
bunx prisma generate
bunx prisma migrate dev
```

#### Node modules issues
```bash
rm -rf node_modules bun.lockb
bun install
```

#### Clear Next.js cache
```bash
rm -rf .next
bun run dev
```

---

## Notes

- Always use `bunx` instead of `npx` when using bun as package manager
- Use `-9` signal for force kill (e.g., `kill -9 <PID>`)
- Be careful with `rm -rf` and `docker system prune -a` as they are destructive
- Always backup database before running `prisma migrate reset`
- Use `.gitignore` to exclude `node_modules`, `.next`, `.env` from version control

---

Generated by AI as directed by the development team on January 25, 2026
