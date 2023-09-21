const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000; // You can choose your desired port number

// Middleware for parsing JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static("public"));

const { exec } = require("child_process");

app.post("/create-user", (req, res) => {
  const {
    username,
    password,
    "public-key": publicKey,
    "private-key": privateKey,
  } = req.body;

  // Command to check if the user exists
  const checkUserCommand = `id -u ${username} > /dev/null 2>&1 && echo 'User exists' || echo 'User does not exist'`;

  // Execute the command to check if the user exists
  exec(checkUserCommand, (checkError, checkStdout, checkStderr) => {
    if (checkStdout.includes("User exists")) {
      console.error(`User ${username} already exists.`);
      return res.status(400).json({ error: "User already exists." });
    }

    // If the user does not exist, proceed with user creation
    // Command to create a user and set the password
    const createUserCommand = `sudo useradd ${username} -m && echo ${username}:${password} | sudo chpasswd`;

    // Command to save the public key as authorized_keys
    const savePublicKeyCommand = `echo "${publicKey}" | sudo tee -a /home/${username}/.ssh/authorized_keys`;

    // Command to save the private key as id_rsa
    const savePrivateKeyCommand = `echo "${privateKey}" > /home/${username}/.ssh/id_rsa`;

    // Execute the commands in sequence
    exec(createUserCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating user: ${error.message}`);
        return res.status(500).json({ error: "User creation failed." });
      }

      // Save the public key and private key
      exec(
        savePublicKeyCommand,
        (publicKeyError, publicKeyStdout, publicKeyStderr) => {
          if (publicKeyError) {
            console.error(`Error saving public key: ${publicKeyError.message}`);
            return res.status(500).json({ error: "Public key saving failed." });
          }

          exec(
            savePrivateKeyCommand,
            (privateKeyError, privateKeyStdout, privateKeyStderr) => {
              if (privateKeyError) {
                console.error(
                  `Error saving private key: ${privateKeyError.message}`
                );
                return res
                  .status(500)
                  .json({ error: "Private key saving failed." });
              }

              // User creation and key saving successful
              res.status(200).json({ message: "User created successfully." });
            }
          );
        }
      );
    });
  });
});

app.post("/check-username", (req, res) => {
  const { username } = req.body;

  // Check if the username already exists
  const checkUserCommand = `id -u ${username} > /dev/null 2>&1 && echo 'User exists' || echo 'User does not exist'`;

  // Execute the command to check if the user exists
  exec(checkUserCommand, (error, stdout, stderr) => {
    if (stdout.includes("User exists")) {
      // Username is not available
      res.status(409).json({ available: false });
    } else {
      // Username is available
      res.status(200).json({ available: true });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
