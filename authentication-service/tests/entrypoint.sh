python -m pylint $(find . -type f -name "*.py" | tr '\n' ' ') > /app/reports/pylint_report.txt
cat /app/reports/pylint_report.txt

python -m pytest --cov=app --cov-report term-missing tests/ > /app/reports/unit_test_report.txt
cat /app/reports/unit_test_report.txt