# Module ISO9001 - Backend
## Instalation and Configuration
To run the project you must follow the following steps:
### Configuring the environment
1. Install Python if you don't have it installed on your machine. You can do this by running the following command:
```bash
sudo apt-get install python3
```
2. Next, install pip, the Python package manager, by running the following command:
```bash
sudo apt-get install python3-pip
```
3. Install the virtualenv package by running the following command:
```bash
sudo apt-get install python3-venv
```
4. Install SQLite3 by running the following command:
```bash
sudo apt install postgresql
```
5. Check that you have installed all the dependencies by running the following commands:
```bash
python3 --version
pip3 --version
psql --version
```
Once you have installed all the dependencies, you can continue with the next steps to run the project.
--- 
#### Creating a virtual environment
To run the project you must create a virtual environment. To do this, follow the following steps:

1. Create a directory where you want to store the virtual environment. You can do this by running the following command:
```bash
mkdir <directory_name>
```
2. Change to the directory you just created by running the following command:
```bash
cd <directory_name>
```

3. Create the virtual environment by running the following command:
```bash
python3 -m venv .venv
```

4. Activate the virtual environment by running the following command:
```bash
source .venv/bin/activate
```
You will know that the virtual environment is activated when you see the name of the virtual environment in parentheses at the beginning of the command line.

Every time you want to run the project you must activate the virtual environment, repeating step 4.

- To deactivate the virtual environment, run the following command:
```bash
deactivate
```
---

### Installing requeriments
1. Clone the repository by running the following command:
```bash
git clone <repo-url>
```
2. Next, you must to activate the virtual environment. To do this, follow the steps in the "Creating a virtual environment" section.

3. Once the virtual environment is activated, change to the directory where the repository was cloned by running the following command:
```bash
cd path/to/backend
```
4. Install the project dependencies by running the following command:
```bash
pip install -r requirements.txt
```

If you have any problems with the installation, you can try to install the dependencies one by one by running the following command:
```bash
pip install <dependency_name>
```
Once you have installed all the dependencies, you can continue with the next steps to run the project.

---
## Database configuration
To connect to default template database in PostgreSQL, you must follow the following steps:
1. Open the terminal command line by running the following command:
```bash
sudo -u postgres psql template1
```
2. Once in the PostgreSQL command line, create a new user by running the following command:
```bash
ALTER USER postgres with encrypted password 'your_password';
```
3. Next, create a new database by running the following command:
```bash
CREATE DATABASE iso9001;
```
4. Finally, quit the PostgreSQL command line by running pressing `ctrl + z`, and run the next command to connect to the database:
```bash
psql --host localhost --username postgres --password --dbname template1
```
5. Next you must to enter your password to connect to the database.


## Running the project
To run the project in your local machine, follow the following step:
```bash
cd app
```

To start te server run:
```bash
flask --app main --debug run
```

To run the tests:
1. Change directory to root directory and run
```bash
pytest tests/
```
If you want to run only especifics tests, you can run:
```bash
pytest -m tests/test_you_want.py
```
