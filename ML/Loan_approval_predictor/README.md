# Loan Approval Prediction(Machine learning project)
This project predicts whether a bank loan application should be **approved** or **rejected**, using machine learning models trained on customer data.  
It is designed as an end-to-end ML pipeline: data cleaning → preprocessing → modeling → evaluation → visualization.

---
 ## **Project Overview**
  - **Goal:** Predict loan approval (1) or rejection (0)
- **Dataset:** Contains customer features like:
  - Number of dependents
  - Education status
  - Self-employment status
  - Annual income
  - Loan amount & term
  - CIBIL score
  - Asset values
- **Models tried:**
  - Random Forest 
- **Evaluation:** Accuracy, confusion matrix, classification report, and visualizations

---

## **Tech Stalk and Libraries**
- Python
- Pandas, NumPy (data analysis & cleaning)
- Scikit-learn (modeling & evaluation)
- Seaborn, Matplotlib (visualization)

---

## **Project Steps**
**Step 1: Data Cleaning**
- Removed missing values and inconsistent data
- Mapped categorical variables to numerical (e.g., `Graduate` → 1, `Not Graduate` → 0)

**Step 2: Model Building**
- Split data into train and test sets
- Used models: Random Forest

**Step 3: Model Evaluation**
- Confusion matrix
- Accuracy, precision, recall, F1-score
- Cross-validation to check stability

---
## **Results**
 - *Accuracy is ~97% on the test set for RandomForest.

## **Visulizations**
- Countplot showing actual vs predicted approvals
![countplot](/plots/plot.png)