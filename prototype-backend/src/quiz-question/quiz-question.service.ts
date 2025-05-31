import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestion } from './entities/quiz-question.entity';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class QuizQuestionService {
  constructor(
    @InjectRepository(QuizQuestion)
    private readonly quizQuestionRepository: Repository<QuizQuestion>,
  ) {}

  async findAll(): Promise<QuizQuestion[]> {
    return await this.quizQuestionRepository.find();
  }

  async findOne(idQuiz: number, idQuestion: number): Promise<QuizQuestion> {
    return await this.quizQuestionRepository.findOne({
      where: { idQuiz, idQuestion },
    });
  }

  async findByQuiz(idQuiz: number): Promise<QuizQuestion[]> {
    const quizQuestion = await this.quizQuestionRepository.find({
      where: { idQuiz: Equal(idQuiz) },
    });
    if (!quizQuestion) {
      throw new NotFoundException(`QuizQuestion with id ${idQuiz} not found`);
    }
    return quizQuestion;
  }

  async create(
    createQuizQuestionDto: CreateQuizQuestionDto,
  ): Promise<QuizQuestion> {
    const quizQuestion = this.quizQuestionRepository.create(
      createQuizQuestionDto,
    );
    return await this.quizQuestionRepository.save(quizQuestion);
  }

  async update(
    idQuiz: number,
    idQuestion: number,
    updateQuizQuestionDto: UpdateQuizQuestionDto,
  ): Promise<QuizQuestion> {
    await this.quizQuestionRepository.update(
      { idQuiz, idQuestion },
      updateQuizQuestionDto,
    );

    return await this.findOne(idQuiz, idQuestion);
  }

  async updateOrders(
    idQuiz: number,
    newOrders: { idQuestion: number; order: number }[],
  ): Promise<QuizQuestion[]> {
    for (const newOrder of newOrders) {
      await this.quizQuestionRepository.update(
        {
          idQuiz: idQuiz,
          idQuestion: newOrder.idQuestion,
        },
        { order: newOrder.order },
      );
    }

    return await this.findByQuiz(idQuiz);
  }

  async remove(idQuiz: number, idQuestion: number): Promise<void> {
    await this.quizQuestionRepository.delete({ idQuiz, idQuestion });
  }

  async removeByIdQuiz(idQuiz: number): Promise<void> {
    await this.quizQuestionRepository.delete({ idQuiz });
  }

  async removeByIdQuestion(idQuestion: number): Promise<void> {
    await this.quizQuestionRepository.delete({ idQuestion });
  }
}
