import streamlit as st
import numpy as np
import joblib

# Load trained model
model = joblib.load("loan_approval_model.pkl")

# Page settings
st.set_page_config(page_title="Loan Approval Predictor")
st.title("🏦 Loan Approval Predictor")
st.write("Fill out the applicant's details below:")

# Input form
no_of_dependents = st.number_input("Number of Dependents", min_value=0, step=1)
education = st.selectbox("Education", ["Graduate", "Not Graduate"])
self_employed = st.selectbox("Self Employed", ["Yes", "No"])
income_annum = st.number_input("Annual Income (₹)", min_value=0)
loan_amount = st.number_input("Loan Amount (₹)", min_value=0)
loan_term = st.number_input("Loan Term (months)", min_value=1)  # no zero allowed
cibil_score = st.number_input("CIBIL Score", min_value=0)

residential_assets_value = st.number_input("Residential Assets Value (₹)", min_value=0)
commercial_assets_value = st.number_input("Commercial Assets Value (₹)", min_value=0)
luxury_assets_value = st.number_input("Luxury Assets Value (₹)", min_value=0)
bank_asset_value = st.number_input("Bank Asset Value (₹)", min_value=0)

# Encode categorical values
education_encoded = {'Graduate': 1, 'Not Graduate': 0}[education]
self_employed_encoded = {'Yes': 1, 'No': 0}[self_employed]

# Derived Features (same as training)
monthly_income = income_annum / 12
total_assets = residential_assets_value + commercial_assets_value + luxury_assets_value + bank_asset_value
EMI = (loan_amount * 12) / loan_term
balance_income = monthly_income - EMI

# Prepare input in correct order
input_data = np.array([[
    no_of_dependents,
    education_encoded,
    self_employed_encoded,
    income_annum,
    loan_amount,
    loan_term,
    cibil_score,
    residential_assets_value,
    commercial_assets_value,
    luxury_assets_value,
    bank_asset_value,
    monthly_income,
    total_assets,
    EMI,
    balance_income
]])

# Prediction
if st.button("Predict Loan Approval"):
    prediction = model.predict(input_data)[0]
    if prediction == 1:
        st.success("✅ Loan Approved")
    else:
        st.error("❌ Loan Rejected")
