# Stage Build
FROM python:3.11-slim as build

WORKDIR /app

# Install dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

COPY --from=common . /app/common
RUN pip install /app/common

COPY src /app/src

CMD ["python3", "/app/src/main.py"]