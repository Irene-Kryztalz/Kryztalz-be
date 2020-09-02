//add a product
//edit a product
//delete a product
//view all products
//view a specfic product

const getProducts = ( req, res, next ) =>
{
    res.json( { message: "JJJ" } );
};

const postProduct = ( req, res, next ) =>
{

    res.json( { message: "kkk" } );
};

const editProduct = ( req, res, next ) =>
{

    res.json( { message: "edit" } );
};

const deleteProduct = ( req, res, next ) =>
{

    res.json( { message: "delete" } );
};




export
{
    getProducts,
    postProduct
};
