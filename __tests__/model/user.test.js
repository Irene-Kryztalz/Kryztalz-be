import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import setUpDB from "../setUpTests";

//describe user model/actions
/**
 * it should hash user pwd
 * it should generate email token
 * it should generate jwt on signin
 * it should ensure pwd and email match created User
 *
 */

