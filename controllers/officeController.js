const { connection } = require('../connection/connection');

exports.getLogin = (req,res) => {
    res.render('office/login')
}


exports.postLogin = (req, res) => {
    // get params ;
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
    
    connection.query(
      `select * from login where username = '${username}' and password = '${password}' and admin=1 ;`,
      (err, rows, fields) => {
        if (!err) {
          if (rows.length > 0) {
            console.log(rows[0].id);
            req.session.user = username;
            req.session.officeId = rows[0].id;
            console.log(req.session);
            res.redirect("/office");
          } else {
            console.log("wrong username or password");
            res.redirect("/office/login");
          }
        } else {
          console.log("wrong username or password");
        }
      }
    );
   
  };
 


exports.getOfficeHome = (req,res) => {

    if(!req.session.officeId){
        res.redirect('/office/login');
        return;
    }

    const query1 = `select ID,NAME from agent; select count(pid) total_count from property; select count(pid) total_count from property where status = 'closed' and tag = 'sale' ; select count(pid) total_count from property where status = 'closed' and tag = 'rent' ;`
    connection.query(query1,(err,rows,fields) => {
        const agents = rows[0];
        const countp = rows[1];
        const counts = rows[2];
        const countr = rows[3]
        // console.log('rows',rows);
        
            res.render('office/officeHome',{
                agentdata : agents,
                countp : countp,
                counts : counts,
                countr : countr
            })
    });
}

exports.getAgentProfile = (req,res) => {
  if(!req.session.officeId){
    res.redirect('/office/login');
    return;
  }
    const agentId = req.params.agentId;
    const query = `select * from agent where id = '${agentId}'; select * from property where id = '${agentId}'; select count(id) total_count from property where id = '${agentId}'; 
    select  PID,ID,OWNER_NAME,OWNER_MOBILE,NO_OF_BEDROOMS,NO_OF_BATHROOMS,PRICE,STATUS,TAG,LIST_DATE,AREA,CITY,PINCODE from property where id = '${agentId}' and status='closed' and tag = 'sale';  select count(id) total_count from property where id = ${agentId} and status='closed' and tag = 'sale' ;  
    select * from property where id = '${agentId}' and status='closed' and tag = 'rent'; select count(id) total_count from property where id = ${agentId} and status='closed' and tag = 'rent' ;`
    console.log(agentId);
    if(!req.session.officeId){
        res.redirect('/office/login');
        return;
    }

    connection.query(query,(err,rows,fields) => {
        if(!err){
        const agentProfile = rows[0];
        const propertyDetails = rows[1]
        const countProperty = rows[2]
        const sold = rows[3]
        const csold = rows[4]
        const rented = rows[5]
        const crented = rows[6]
        console.log(rows)
        res.render('office/profile',{
            profile : agentProfile,
            pdetails : propertyDetails,
            cproperty : countProperty,
            solds : sold,
            csold : csold,
            rented : rented,
            crented : crented

        });
        }else{
            cosnole.log(err);
        } 
    })
}

exports.getAddAgent = (req, res) => {
  if(!req.session.officeId){
    res.redirect('/office/login');
    return;
  }
  res.render('office/add_agent')

}

exports.postAddAgent = (req, res) => {
  if(!req.session.officeId){
    res.redirect('/office/login');
    return;
  }
  let { name,contact, } = req.body;
  contact = +contact;

  const id = Math.floor(Math.random()*200 + 11);
  console.log(req.body,id);
  const query = `insert into agent (id , name , contact , admin  ) values
  ( '${id}' , '${name}' , '${contact}' , 0 );  
   `;
  connection.query(query,(err,rows,field) => {
    if(!err){
      res.redirect('/office')
    }else{
      console.log(err);
    }
    
  })
}

exports.getAddProperty = (req, res) => {

  if(!req.session.officeId){
    res.redirect('/office/login');
    return;
  }
  
  res.render('office/add_property');
}

exports.postAddProperty = (req, res) => {
  if(!req.session.officeId){
    res.redirect('/office/login')
    return;
  }
  const id = Math.floor(Math.random()*90000 + 100000);
  let { PID,ID , OWNER_NAME , OWNER_MOBILE ,  NO_OF_BEDROOMS , NO_OF_BATHROOMS , PRICE , STATUS , TAG , LIST_DATE , AREA , CITY , pincode } = req.body;
  PID = +PID;
  ID = +ID;
 
  OWNER_MOBILE = +OWNER_MOBILE;
  NO_OF_BEDROOMS = +NO_OF_BEDROOMS;
  NO_OF_BATHROOMS = +NO_OF_BATHROOMS;
  PRICE = +PRICE;
 
  
  
  pincode = +pincode;
 
  
 

  const query = `insert into property (PID , ID , OWNER_NAME , OWNER_MOBILE ,  NO_OF_BEDROOMS , NO_OF_BATHROOMS , PRICE , STATUS , TAG  , AREA , CITY , pincode ) values
  ( '${PID}' , '${ID}' , '${OWNER_NAME}' , '${OWNER_MOBILE}' , '${NO_OF_BEDROOMS}' ,'${NO_OF_BATHROOMS}' ,'${PRICE}' , '${STATUS}' ,'${TAG}'  ,'${AREA}', '${CITY}', '${pincode}');`

  connection.query(query,(err,rows,field)=> {
    if(!err){
      res.redirect('/office');
    }else{
      console.log(err);
    }
  })
  // console.log(req.body);

}

exports.getTotalProperties = (req, res) => {
  if(!req.session.officeId){
    res.redirect('/office/login');
    return
  }
  const query = `select count(id) total_count from property; select * from property;`
  connection.query(query,(err,rows,fields) => {
    const countp = rows[0];
    const pdetails = rows[1];
    res.render('office/total_properties',{
      countp : countp,
      pDetails : pdetails
    })
  })
  
}

exports.getTotalSoldProperties = (req, res) => {
  if(!req.session.officeId){
    res.redirect('/office/login');
    return
  }

  const query = `select count(pid) total_count from property where status = 'closed' and tag = 'sale' ; select *  from property where status = 'closed' and tag = 'sale' ;`
  connection.query(query,(err,rows,fields) => {
    const counts =  rows[0];
    const soldDetails  = rows[1];
    res.render('office/sold_properties',{
      counts : counts,
      soldDetails : soldDetails
    })

  })
 
}

exports.getTotalRentedProperties = (req, res) => {
  if(!req.session.officeId){
    res.redirect('/office/login');
    return
  }
  const query = `select count(pid) total_count from property where status = 'closed' and tag = 'rent' ; select * from property where status = 'closed' and tag = 'rent';`
  connection.query(query,(err,rows,fields) => {
    const rentedp = rows[0];
    const rentedDetails = rows[1]
    res.render('office/rented_properties',{
      rentedp : rentedp,
      rentedDetails : rentedDetails
    })
  })
 
}