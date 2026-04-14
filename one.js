<!DOCTYPE html>
<html>
<head>
  <title>JavaScript in Head</title>
  <script>
    function showMessage() {
    alert("Hello! This message comes from the Head section");
   }
   document.write('This is written by js inside the body');
   document.getElementById('id1').style.color='red';
  </script>
</head>
<body>
    <h2>Click the button below:</h2>
    <button onclick="showMessage()">Click Me</button>
</body>
</html>




