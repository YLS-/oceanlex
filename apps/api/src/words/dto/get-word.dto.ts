import { IsString, Length } from 'class-validator'


export class GetWordDto {

	/** Word ID */
	@IsString({ message: 'ID must be a string' })
	@Length(20, 20, { message: 'ID must be 20 characters long' })
	public id!: string

}
