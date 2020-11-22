const roles =
{
    SUPER_ADMIN: 255,  // 11111111 - all permissions
    ADMIN: 119,        // 01110111 - no delete permissions
    NORMAL: 2,        // 00000010 -only read gem permission,
    READ_ALL: 34
};

export default roles;

//ADMIN PERMISSIONS CAN BE UPDATED AT ANY TIME
