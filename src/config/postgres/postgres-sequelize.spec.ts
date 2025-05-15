import {describe, expect, it, jest} from '@jest/globals';
import { Sequelize } from 'sequelize';
jest.mock('sequelize');


//************* config **************************//
import {DBPostgres,connection} from "./postgres-sequelize";


describe("should validate config postgress", () => {
  it("validate connect success", async() => {
  	jest.spyOn(Sequelize.prototype, 'sync').mockResolvedValue(new Sequelize);
  	await DBPostgres();

  	expect( connection.authenticate).toBeCalled();
  })

  it("validate connect error", async() => {
  	jest.spyOn(Sequelize.prototype, 'authenticate').mockRejectedValue(new Error("error de conection"));
  	try{
  		await DBPostgres();

  	}catch(error:any){
  		 expect(error.message).toEqual('[DatabasePostgres]:Unable to connect to the database:');
  	}
  })
})

