from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import pymysql
from datetime import datetime

app = Flask(__name__)
app.secret_key = "indian_finance_manager_secure_secret_key"

# ==================== 🗄️ MYSQL CONNECTION CONFIGURATION ====================
def get_db_connection():
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='', 
        database='indian_finance_manager',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    return conn

# ==================== DATABASE SCHEMA INITIALIZATION ====================
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Users Table (Name, Email, Phone, Password, State, District, City)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullName VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20),
            password VARCHAR(255) NOT NULL,
            state VARCHAR(100),
            district VARCHAR(100),
            city VARCHAR(100),
            avatar LONGTEXT,
            registeredAt VARCHAR(100)
        )
    ''')
    
    # 2. Expenses / Finalized Records Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            itemName VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            tax DECIMAL(10, 2) NOT NULL,
            expenseDate VARCHAR(50),
            submittedAt VARCHAR(100),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    
    conn.commit()
    conn.close()
    print("📢 MYSQL FINANCE MANAGER DATABASE INITIALIZED SUCCESSFULLY!")

try:
    init_db()
except Exception as db_err:
    print(f"⚠️ DB Init Error: Make sure 'indian_finance_manager' database exists in MySQL! Error: {db_err}")

# ==================== PAGE VIEW ROUTINGS ====================
@app.route('/')
def index(): 
    return render_template('index.html')

@app.route('/login')
def login_page(): 
    return render_template('login.html')

@app.route('/register')
def register_page(): 
    return render_template('register.html')

@app.route('/dashboard')
def dashboard_page():
    if 'user_id' not in session: 
        return redirect(url_for('login_page'))
    return render_template('dashboard.html')

# ==================== AUTHENTICATION & FINANCE APIs ====================

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO users (fullName, email, phone, password, state, district, city, registeredAt)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            data.get('fullName'), 
            data.get('email'), 
            data.get('phone'), 
            data.get('password'), 
            data.get('state'), 
            data.get('district'), 
            data.get('city'), 
            datetime.now().isoformat()
        ))
        conn.commit()
        return jsonify({"success": True, "message": "Registration successful!"})
    except Exception as e:
        return jsonify({"success": False, "message": "Email already registered or database error!"}), 400
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = %s AND password = %s', (email, password))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        session['user_id'] = user['id']
        session['user_name'] = user['fullName']
        return jsonify({"success": True, "user": dict(user)})
        
    return jsonify({"success": False, "message": "Invalid email or password!"}), 401

@app.route('/api/expenses', methods=['GET', 'POST'])
def handle_expenses():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Unauthorized access!"}), 401
        
    user_id = session['user_id']
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if request.method == 'GET':
        cursor.execute('SELECT * FROM expenses WHERE user_id = %s', (user_id,))
        records = cursor.fetchall()
        conn.close()
        return jsonify([dict(r) for r in records])
        
    elif request.method == 'POST':
        data = request.json
        items = data.get('items', [])
        submitted_at = datetime.now().strftime('%d/%m/%Y, %I:%M:%S %p')
        
        for item in items:
            cursor.execute('''
                INSERT INTO expenses (user_id, itemName, price, tax, expenseDate, submittedAt)
                VALUES (%s, %s, %s, %s, %s, %s)
            ''', (
                user_id, 
                item.get('name'), 
                item.get('price'), 
                item.get('tax'), 
                item.get('date'), 
                submitted_at
            ))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Expenses locked successfully!"})

if __name__ == '__main__':
    app.run(debug=True, port=5500)