const { connection } = require("../connection/connection");

exports.getLogin = (req, res) => {
  res.render("agent/login");
};

exports.postLogin = (req, res) => {
  // get params ;
  const username = req.body.username;
  const password = req.body.password;
  // console.log(username, password);

  connection.query(
    `select * from login where username = '${username}' and password = '${password}';`,
    (err, rows, fields) => {
      if (!err) {
        if (rows.length > 0) {
          // console.log(rows[0].a_id);
          req.session.user = username;
          req.session.agentId = rows[0].id;
          // console.log(req.session);

          res.redirect("/agent");
        } else {
          console.log("wrong username or password");
          res.redirect("/agent/login");
        }
      } else {
        console.log("wrong username or password");
      }
    }
  );
  // perform check on

  // if yes set up an xookies and session
};

exports.getAgenthome = (req, res) => {
  let agentInfo;
  let agentId = req.session.agentId;
  let propertyDetails;
  let property_sold_rented;
  // console.log("session", req.session);
  if(!req.session.agentId){
    res.redirect('/agent/login');
  }
  connection.query(
    `SELECT * FROM agent WHERE id = '${agentId}' ; 
     select * from property WHERE id = '${agentId}';
     select PID,AREA,CITY,STATUS,TAG from property where (STATUS = 'closed' or STATUS = 'open') and id = '${agentId}'  ; `,
    (err, rows, fields) => {
      console.log(rows);
      agentInfo = rows[0];
      console.log(agentInfo[0]);
      propertyDetails = rows[1];
      console.log("agentinfo d", agentInfo);
     
      property_sold_rented = rows[2];
      console.log(property_sold_rented);
      
      res.render("agent/agentHome", {
        info: agentInfo,
        pDetails: propertyDetails,
        sold_rented : property_sold_rented
       
      });
    }
  );
};
exports.postUpdateProperty = (req,res) => {
  const propertyId = req.params.propertyId;
  const agentId = req.session.agentId;
  const { status } = req.body
  if(!agentId){
    res.redirect('/agent/login');
    return;
  }
  const query = `update property set STATUS='${status}' where pid='${propertyId}';`
  connection.query(query,(err,rows,field) => {
    if(!err){
      res.redirect('/agent')
    }else{
      console.log(err);
    }
  })

  console.log(propertyId, agentId, status);
};
