# Gatepass App - Test Login Credentials

Use these accounts to test the different role-based dashboards and features:

| Role      | Email                  | Password   | Description                   |
|-----------|------------------------|------------|-------------------------------|
| **Admin** | `admin1@example.com`   | `admin123` | Full control over pass system |
| **Student**| `student1@example.com` | `student123`| Apply for gate passes        |
| **Guard**  | `guard1@example.com`   | `guard123` | Scan and verify QR codes      |
| **Visitor**| `visitor1@example.com` | `visitor123`| Request entry as a guest     |

---

### **How to setup new accounts:**
1. Navigate to the **Login** screen.
2. Select your desired role (e.g., Student).
3. Tap **"Don't have an account? Sign Up"**.
4. Fill in the details (Name, Email, Password, etc.) and register.
5. All data is saved persistently in MongoDB Atlas.

### **Important Notes:**
- **Backend URL:** `http://localhost:5000/api`
- **DB Connection:** Connected to MongoDB Atlas Cloud.
- **Session:** Changes to profile names are saved in the `User` collection.
