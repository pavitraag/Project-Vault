# Fake News Classifier using Machine Learning

This repository contains a fake news classification system that uses a dataset of **real** and **fake** news articles. The system predicts whether a given news article is real or fake based on its textual content using machine learning techniques.

---

## Project Structure

- Fake_News_Classifier.ipynb: This notebook contains the complete implementation of the fake news detection system including preprocessing, model training, evaluation, and visualizations.

---

## Dataset
The dataset used in this project is loaded from data folder (fake.csv, true.csv), downloaded from Kaggle - [Fake and Real News Dataset](https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset) and contains information about various news articles, including:

- title: Title of the news article
- subject: Subject of the news article
- date: Date on which the news article was published
- text: Full text/content of the news article
- class: Class label (0 for fake news, 1 for real news) - manually created

We are only using **text** and **class** columns

---

## Model Explanation
The fake news classifier implemented in the notebook uses a machine learning pipeline based on **TF-IDF vectorization** and various models like **Logistic Regression**, **Decision Tree Classifier**, **Gradient Boosting Classifier**, and **Random Forest Classifier**. The model predicts whether a news article is fake or real based on its textual content.

**Steps Involved:**

1. **Data Exploration:**
- The dataset is loaded using Pandas.
- Basic exploration is done using .head(), .info(), .isnull(), and value counts to understand the structure and class distribution.

2. **Data Preprocessing:**
- Basic text cleaning (lowercasing, stopword and punctuation removal).
- Feature extraction using **TF-IDF** (Term Frequency-Inverse Document Frequency).

3. **Model Training:**
- Four different models are trained: Logistic Regression, Decision Tree, Random Forest, and Gradient Boosting.
- Data is split into training, validation, and test sets.

4. **Evaluation:**
- Model performance is evaluated using accuracy, precision, recall, and F1-score.
- A confusion matrix is plotted for visual understanding of predictions.

5. **Visualization:**
- Class distribution plot
- Most Common Words
- News length distribution
- Confusion matrix (for each model)
- Top predictive features (for tree based models)

---

## How to Run
1. Clone the repository.
2. Install the required libraries:
        pip install -r requirements.txt
3. Open the Fake_News_Classifier.ipynb notebook in Jupyter Notebook or Google Colab.
4. Run all cells sequentially to execute data preprocessing, model training, evaluation, and visualization.

---

## Conclusion
This fake news classifier demonstrates the use of multiple machine learning algorithms to accurately detect misinformation in textual data. Each model is evaluated, compared, and visualized for deeper insights. 
The project can be extended using deep learning models (e.g., LSTM, BERT) for better generalization and semantic understanding.

It highlights the role of AI and NLP in identifying fake news and combating misinformation in the digital era.
