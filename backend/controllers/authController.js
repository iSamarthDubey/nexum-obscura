// controllers/authController.js
// Dummy authentication controller (later we add MongoDB + JWT)

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // for now return fake success response
  res.status(201).json({
    message: "User created successfully",
    user: { name, email }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // return dummy token
  res.status(200).json({
    token: "fake-jwt-token-12345",
    user: { email }
  });
};

