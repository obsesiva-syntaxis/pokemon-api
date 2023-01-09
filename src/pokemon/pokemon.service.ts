import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (err) {
      this.handleException(err);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) pokemon = await this.pokemonModel.findOne({ no: term });
    if (!pokemon && isValidObjectId(term)) pokemon = await this.pokemonModel.findById(term);
    if (!pokemon) pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or nro ${term} Not Found!`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (err) {
      this.handleException(err);
    }
  }

  async remove(id: string) {
    // const result = await this.pokemonModel.findByIdAndDelete( id );
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if ( deletedCount === 0 ) throw new BadRequestException(`Pokemon with id ${ id } Not Found!`);
    return;
  }
  
  private handleException ( err: any ) {
    if (err.code === 11000) {
      throw new BadRequestException(`Pokemon exists in database ${JSON.stringify(err.keyValue)}`)
    }
    console.log(err);
    throw new InternalServerErrorException(`Can+t create Pokemon - Check server logs`);
  }
}
