# Step 1: Use official Node image as base
FROM node:22-alpine

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of your app code
COPY . .

# Step 5: Expose the port your app runs on (3000)
EXPOSE 3000

# Step 6: Define the command to run the app
CMD ["node", "index.js"]
