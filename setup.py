from setuptools import setup, find_packages

setup(
    name="pocket-cube-solver",  # Package name
    version="1.0.0",           # Initial version
    author="Gal Vaknin",
    py_modules=['main', 'gui_module', 'pocket_cube', 'solve_cube'],  # Replace with your main module name
    author_email="gal9846@gmail.com",  # Replace with your email
    description="A solver for the Pocket Cube using precomputed state trees.",
    long_description=open("README.txt").read(),  # Use README content for PyPI or help info
    long_description_content_type="text/plain",
    url="https://github.com/gal10/pocket-cube-solver",  # Repository URL
    packages=find_packages(),  # Automatically find all modules and packages
    include_package_data=True,  # Include data files like JSON or pkl in the package
    python_requires=">=3.7",    # Minimum Python version requirement
    install_requires=[
        "pymongo",
        "matplotlib"
    ],  # Dependencies required for the package
    entry_points={
        "console_scripts": [
            "pocket-cube-solver=main:main"  # Define the CLI command and entry point
        ]
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
)
