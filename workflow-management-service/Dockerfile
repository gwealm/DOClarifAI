# Stage Build
FROM python:3.11-slim as build

WORKDIR /app



# Install dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

COPY --from=common . /app/common
RUN pip install /app/common

COPY ./app /app/app
COPY ./ES256 /app/ES256


# Stage Tests
FROM build as tests
    RUN apt install 
    COPY .pylintrc /app/.pylintrc
    COPY /tests/ /app/tests/
    COPY /tests/entrypoint.sh /app/entrypoint.sh
    COPY /reports /app/reports
    RUN pip install pytest pytest-cov pylint
    CMD ["sh","entrypoint.sh"]

# Stage App
FROM build as app
    CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]
