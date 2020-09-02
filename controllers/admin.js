//add a Gem
//edit a Gem
//delete a Gem
//view all Gems
//view a specfic Gem

const getGems = ( req, res, next ) =>
{
    res.json( { message: "JJJ" } );
};

const postGem = ( req, res, next ) =>
{

    res.json( { message: "kkk" } );
};

const editGem = ( req, res, next ) =>
{

    res.json( { message: "edit" } );
};

const deleteGem = ( req, res, next ) =>
{

    res.json( { message: "delete" } );
};




export
{
    getGems,
    postGem,
    editGem,
    deleteGem
};
