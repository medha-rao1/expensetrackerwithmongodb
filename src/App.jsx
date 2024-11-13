import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const App = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // User credentials (for login and signup)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');

  // Active page state
  const [activePage, setActivePage] = useState('home');

  // Financial data
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeList, setIncomeList] = useState([]);
  const [expenditureAmount, setExpenditureAmount] = useState('');
  const [expenditureList, setExpenditureList] = useState([]);
  const [savingsAmount, setSavingsAmount] = useState('');
  const [savingsList, setSavingsList] = useState([]);
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDueDate, setLoanDueDate] = useState('');
  const [loanList, setLoanList] = useState([]);
  const [balance, setBalance] = useState(0);

  

  const [chartData, setChartData] = useState({
    labels: ['Income', 'Expenditure', 'Savings', 'Loans'],
    datasets: [
      {
        label: 'Financial Overview',
        data: [0, 0, 0, 0],
        backgroundColor: ['#34b7f1', '#e74c3c', '#2ecc71', '#f39c12'],
        borderColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    }
  }, [token]);

  // Authentication functions
  const handleLogin = async () => {
    const userData = { username, password };
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.status === 200) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', data.token);
        alert('Logged in successfully');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSignup = async () => {
    const userData = { name, age, mobileNo, email, username, password };
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.status === 201) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', data.token);
        alert('Account created successfully');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('authToken');
    setActivePage('home');
  };

  // Financial functions
  const handleAddIncome = () => {
    if (!incomeAmount || isNaN(incomeAmount) || incomeAmount <= 0) {
      alert("Please enter a valid income amount");
      return;
    }
    const newIncome = { amount: parseFloat(incomeAmount) };
    setIncomeList([...incomeList, newIncome]);
    setBalance(balance + newIncome.amount);
    updateChartData();
    setIncomeAmount(''); // Clear input field
  };

  const handleAddExpenditure = () => {
    if (!expenditureAmount || isNaN(expenditureAmount) || expenditureAmount <= 0) {
      alert("Please enter a valid expenditure amount");
      return;
    }
    const newExpenditure = { amount: parseFloat(expenditureAmount) };
    setExpenditureList([...expenditureList, newExpenditure]);
    setBalance(balance - newExpenditure.amount);
    updateChartData();
    setExpenditureAmount(''); // Clear input field
  };

  const handleAddSavings = () => {
    if (!savingsAmount || isNaN(savingsAmount) || savingsAmount <= 0) {
      alert("Please enter a valid savings amount");
      return;
    }
    const newSavings = { amount: parseFloat(savingsAmount) };
    setSavingsList([...savingsList, newSavings]);
    setBalance(balance + newSavings.amount);
    updateChartData();
    setSavingsAmount(''); // Clear input field
  };

  const handleAddLoan = () => {
    if (!loanAmount || isNaN(loanAmount) || loanAmount <= 0 || !loanDueDate) {
      alert("Please enter a valid loan amount and due date");
      return;
    }
    const newLoan = { amount: parseFloat(loanAmount), dueDate: loanDueDate };
    setLoanList([...loanList, newLoan]);
    setBalance(balance - newLoan.amount);
    updateChartData();
    setLoanAmount(''); // Clear input field
    setLoanDueDate(''); // Clear due date field
  };

  const handleDeleteLoan = (index) => {
    const updatedLoanList = loanList.filter((_, i) => i !== index);
    setLoanList(updatedLoanList);
    updateChartData();
  };


  const updateChartData = () => {
    setChartData({
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          data: [
            incomeList.reduce((acc, curr) => acc + curr.amount, 0),
            expenditureList.reduce((acc, curr) => acc + curr.amount, 0),
            savingsList.reduce((acc, curr) => acc + curr.amount, 0),
            loanList.reduce((acc, curr) => acc + curr.amount, 0),
          ],
        },
      ],
    });
  };

  return (
    <div style={styles.appContainer}>
      {isAuthenticated ? (
        <div>
          <h1 style={styles.header}>Financial Dashboard</h1>

          <div style={styles.navbar}>
            <button onClick={() => setActivePage('income')} style={styles.navButton}>Add Income</button>
            <button onClick={() => setActivePage('expenses')} style={styles.navButton}>Add Expenditure</button>
            <button onClick={() => setActivePage('savings')} style={styles.navButton}>Add Savings</button>
            <button onClick={() => setActivePage('loan')} style={styles.navButton}>Add Loan</button>
            <button onClick={() => setActivePage('visual')} style={styles.navButton}>Visual Representation</button>
            <button onClick={handleLogout} style={styles.navButton}>Logout</button>
          </div>

          {activePage === 'home' && (
            <div style={styles.profileContainer}>
              <h2>Welcome</h2>
              <h3>Balance: ₹{balance}</h3>
            </div>
          )}

          {activePage === 'income' && (
            <div style={styles.transactionContainer}>
              <h3>Add Income</h3>
              <input type="number" placeholder="Amount" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} style={styles.inputField} />
              <button onClick={handleAddIncome} style={styles.submitButton}>Add Income</button>
              <button onClick={() => setActivePage('home')} style={styles.backButton}>Back to Home</button>
            </div>
          )}

          {activePage === 'expenses' && (
            <div style={styles.transactionContainer}>
              <h3>Add Expenditure</h3>
              <input type="number" placeholder="Amount" value={expenditureAmount} onChange={(e) => setExpenditureAmount(e.target.value)} style={styles.inputField} />
              <button onClick={handleAddExpenditure} style={styles.submitButton}>Add Expenditure</button>
              <button onClick={() => setActivePage('home')} style={styles.backButton}>Back to Home</button>
            </div>
          )}

          {activePage === 'savings' && (
            <div style={styles.transactionContainer}>
              <h3>Add Savings</h3>
              <input type="number" placeholder="Amount" value={savingsAmount} onChange={(e) => setSavingsAmount(e.target.value)} style={styles.inputField} />
              <button onClick={handleAddSavings} style={styles.submitButton}>Add Savings</button>
              <button onClick={() => setActivePage('home')} style={styles.backButton}>Back to Home</button>
            </div>
          )}

          {activePage === 'loan' && (
            <div style={styles.transactionContainer}>
              <h3>Add Loan</h3>
              <input type="number" placeholder="Amount" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} style={styles.inputField} />
              <input type="date" value={loanDueDate} onChange={(e) => setLoanDueDate(e.target.value)} style={styles.inputField} />
              <button onClick={handleAddLoan} style={styles.submitButton}>Add Loan</button>
              <button onClick={() => setActivePage('home')} style={styles.backButton}>Back to Home</button>

              {loanList.length > 0 && (
                <div style={styles.loanList}>
                  <h4>Current Loans:</h4>
                  <ul>
                    {loanList.map((loan, index) => (
                      <li key={index} style={styles.loanItem}>
                        <span>Loan Amount: ₹{loan.amount}, Due Date: {loan.dueDate}</span>
                        <button onClick={() => handleDeleteLoan(index)} style={styles.deleteButton}>Mark as Paid</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activePage === 'visual' && (
            <div style={styles.transactionContainer}>
              <h3>Visual Representation</h3>
              <Line data={chartData} options={{ responsive: true }} />
              <button onClick={() => setActivePage('home')} style={styles.backButton}>Back to Home</button>
            </div>
          )}
        </div>
      ) : (
        <div>
         <h1 style={styles.header}>Financial Dashboard</h1>
          <h2>Login</h2>
          <input style={styles.inputField} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input style={styles.inputField} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
          <button onClick={() => setActivePage('signup')}>Sign Up</button>
        </div>
      )}

      {activePage === 'signup' && (
        <div>
         <h1 style={styles.header}>Financial Dashboard</h1>
          <h2>Sign Up</h2>
          <input style={styles.inputField} type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input style={styles.inputField} type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
          <input style={styles.inputField} type="text" placeholder="Mobile No." value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} />
          <input style={styles.inputField} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={styles.inputField} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input style={styles.inputField} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleSignup}>Sign Up</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  appContainer: { 
    textAlign: 'center', 
    fontFamily: 'Arial, sans-serif', 
    background: 'linear-gradient(to right, #3498db, #9b59b6)', // Blue to Purple gradient
    height: '100vh', // Full viewport height
    width: '100vw', // Full viewport width
    padding: '20px', 
    margin: '0', // Remove default margin
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: { color: '#2d3436', fontSize: '30px', fontWeight: 'bold' },
  navbar: { marginTop: '20px' },
  navButton: { 
    margin: '10px', 
    padding: '12px 20px', 
    fontSize: '16px', 
    backgroundColor: '#3498db', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '4px',
    cursor: 'pointer',
  },
  profileContainer: { 
    marginTop: '20px', 
    padding: '20px', 
    backgroundColor: '#fff', 
    borderRadius: '8px', 
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
  },
  transactionContainer: { 
    marginTop: '20px', 
    padding: '20px', 
    backgroundColor: '#fff', 
    borderRadius: '8px', 
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
  },
  inputField: { 
    padding: '12px', 
    margin: '10px', 
    width: '300px', 
    fontSize: '16px', 
    borderRadius: '4px', 
    border: '1px solid #ddd' 
  },
  submitButton: { 
    padding: '10px 20px', 
    backgroundColor: '#4CAF50', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer' 
  },
  backButton: { 
    padding: '10px 20px', 
    backgroundColor: '#3498db', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer' 
  },
  authContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    padding: '40px', 
    backgroundColor: '#fff', 
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
    borderRadius: '8px', 
    maxWidth: '400px', 
    margin: 'auto' 
  },
  authHeader: { color: '#2d3436', fontSize: '24px', fontWeight: 'bold' }
};


export default App;
