# Step 1: Use an official Node.js runtime as the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files into the container
COPY . .

# Step 6: Build the Next.js app for production
RUN npm run build

# Step 7: Expose the port on which the app will run (default for Next.js is 3000)
EXPOSE 3000

# Step 8: Run the Next.js app in production mode
CMD ["npm", "start"]
