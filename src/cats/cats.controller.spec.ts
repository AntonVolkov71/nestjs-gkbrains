// import { Test, TestingModule } from '@nestjs/testing';
// import { CatsController } from './cats.controller';
// import { CatsService } from './cats.service';
//
// describe('CatsController', () => {
//   let catsController: CatsController;
//   let catsService: CatsService;
//
//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       controllers: [CatsController],
//       providers: [CatsService],
//     }).compile();
//
//     catsService = moduleRef.get<CatsService>(CatsService);
//     catsController = moduleRef.get<CatsController>(CatsController);
//   });
//
//   describe('findAll', () => {
//     it('should return an array of cats', async () => {
//       const result = [];
//       jest.spyOn(catsService, 'findAll').mockImplementation(() => result);
//       const _result = catsController.findAll()
//       console.log('_re',_result);
//       expect(catsController.findAll()).toBe(result);
//     });
//   });
// })
