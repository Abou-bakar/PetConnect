# PetConnect
PetConnect is a full-stack web application designed to connect pet lovers through adoption listings, health tracking, event sharing, and a dedicated social network for pet owners.

## Features
- **Pet Adoption**: Browse and post pets available for adoption

- **Health Tracker**: Track and manage pet health data

- **Social Feed**: Share updates and connect with other pet owners

- **Event Management**: Create and discover pet-related events

- **User Authentication**: Secure login and registration system

## Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Other Tools**: Git, GitHub, npm, Postman

## Installation
Follow these steps to set up PetConnect locally:

1. **Clone the Repository**
https://github.com/Abou-bakar/PetConnect.git

2. **Set Up MySQL Database**
- Install MySQL and create a database named `petconnect_db`.
- Run the SQL script in `database/setup.sql` to create tables.
- Update database credentials in `backend/config/db.js` (e.g., host, user, password).

3. **Navigate to Project Directory**
- cd PetConnect

4. **Install Dependencies**
- **For backend**:
- cd ../server
- npm install
- npm start

- **For frontend**:
- npm install
- npm start

- The app runs on `http://localhost:3000` (frontend) and `http://localhost:5000` (backend).

## Usage
- Open `http://localhost:3000` in your browser.
- Signup/Login.
- Browse Pets/Request for adoption.
- Enter your pet health details/Set Reminders (e.g., vaccination, checkup).
- Interact with other users through socail network.
- View upcoming pet events.

## Contributors
- **Abu Bakar Siddique** - Documentation
- **Hammad Shahid** - Frontend
- **Abdul Manan** Backend and Database

## Contributing
Contributions are welcome! To contribute:
1. Fork this repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License
This project is for educational use only.

