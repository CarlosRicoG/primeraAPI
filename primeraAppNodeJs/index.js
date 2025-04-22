import express from "express";
import fs from "fs"; 
import bodyParser from "body-parser"

const app = express();

app.use(bodyParser.json());


//Leer la data del archivo
const readData = () => {
    try {
        const data = fs.readFileSync("./db.json"); 
        return JSON.parse(data)
    } catch (error) { 
        console.log("Error al intentar leer los datos", error)
    }
};

readData();


const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data))
    } catch (error) {
        console.log("Error al escribir", error)
    }
};


app.get("/", (req, respuesta) => {
    
    respuesta.send("Bienvenido la primara API con NodeJs ") 
});



app.get("/libros", (req, respuesta) => {
    const data = readData()
    respuesta.json(data.libros)
})


// Define una ruta GET para obtener un libro por su id
app.get("/libros/:id", (req, respuesta) => {
    
    const data = readData()

    
    const id = parseInt(req.params.id)

    
    const aulibroto = data.libros.find((libro) => libro.id === id)

    
    respuesta.json(libros);
});


// Define una ruta POST para agregar un nuevo libro
app.post("/libros", (req, respuesta) => {
    // Lee los archivos actuales de los libros 
    const data = readData();


    // Extrae el cuerpo de la solicitud 
    const body = req.body;

    //Crea un nuevo objeto de el Libro con ID unico
    const newLibro = {
        id: data.libros.length + 1, // Asigna un ID basado en la longitud del array
        ...body, 
    };

    
    // Agrega el nuevo libro
    data.libros.push(newLibro);

    
    // Guarda los datos Actualizados
    writeData(data);


    respuesta.json(newLibro)
});


// Actualizar
app.put("/libros/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const newLibro = req.body;

    const index = data.libros.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ mensaje: "Libro no encontrada" });
    }

    data.libros[index] = { id, ...newLibro };
    writeData(data);

    res.json(data.libros[index]);
});


//Ruta para eliminar un libro por su ID
app.delete("/libros/:id", (req, respuesta) => {
    // leer los datos actuales
    const data = readData();

    //Obtener el ID de el libro que se va a eliminar desde los parametros de la URL y convertirlo a numero
    const id = parseInt(req.params.id);

    // Buscar el indice de el libro en el array de Libros usando el ID
    const indexLibros = data.libros.findIndex((libro) => libro.id === id);

    data.libros.splice(indexLibros, 1);

    writeData(data)

    respuesta.json({ message: "El libro fue eliminada exitosamente!" });
});


//La app espera la solicitud
app.listen(3000, () => {
    console.log("El servidor esta levantado en el puerto 3000 ");
});