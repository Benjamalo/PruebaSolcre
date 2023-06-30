const controller ={}


controller.list = (req,res)=>{
    req.getConnection((err,conn)=>{
        conn.query('SELECT * FROM perfil',(err,perfil)=>{
            if (err) {
                res.json(err)
            }else{
                res.send(perfil)
                console.log('conexion exitosa')
            }
        })
    })
}
module.exports = controller