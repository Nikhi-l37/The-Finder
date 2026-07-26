# STEP 1: The Base Image
# We don't start from scratch. We grab a lightweight Linux OS 
# that already has Node.js version 18 pre-installed.
FROM node:18-alpine

# STEP 2: The Working Directory
# We create a folder inside our container called /app to hold our code
WORKDIR /app

# STEP 3: Copy Dependencies
# We copy ONLY the package.json file first. 
# (This is a pro-trick to make builds faster!)
COPY package*.json ./

# STEP 4: Install Packages
# We run npm install inside the container to grab Express, Postgres, etc.
RUN npm install

# STEP 5: Copy The Rest of the Code
# Now we copy all our actual index.js, routes, and logic into the /app folder
COPY . .

# STEP 6: Open the Port
# We tell the container to expose port 3001 to the outside world
EXPOSE 3001

# STEP 7: Start the Engine!
# This is the command the container runs the second it wakes up.
CMD ["npm", "start"]