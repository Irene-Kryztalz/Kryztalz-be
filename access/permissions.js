const permissions =
{
    ADD_GEM: 1,       // 00000001
    READ_GEM: 2,      // 00000010
    EDIT_GEM: 4,      // 00000100
    DELETE_GEM: 8,    // 00001000
    ADD_USER: 16,     // 00010000
    READ_USER: 32,    // 00100000
    EDIT_USER: 62,    // 01000000
    DELETE_USER: 128, // 10000000

};

const inverse = {};

Object.keys( permissions ).forEach( k =>
{
    inverse[ permissions[ k ] ] = k;
} );

export { inverse };

export default permissions;
