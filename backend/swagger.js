'use strict';

module.exports = {
  swaggerDefinition: {
    // 정보
    info: {
      title: 'essay-api',
      version: '1.0.0',
      description: 'essay-project api doc'
    },
    // 주소
    host: 'localhost:6011',
    // 기본 root path
    basePath: '/',
    contact: {
      email: ''
    },
    // 각 api에서 설명을 기록할 때 사용할 constant들을 미리 등록해놓는것
    components: {
      res: {
        BadRequest: {
          description: '잘못된 요청입니다',
          schema: {
            $ref: '#/components/errorResult/Error'
          }
        },
        Forbidden: {
          description: '권한이 없습니다',
          schema: {
            $ref: '#/components/errorResult/Error'
          }
        },
        NotFound: {
          description: '해당 리소스가 없습니다',
          schema: {
            $ref: '#/components/errorResult/Error'
          }
        }
      },
      errorResult: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: '에러 메시지 전달.'
            }
          }
        }
      }
    },
    schemes: ['http', 'https'], // 가능한 통신 방식
    definitions: {
      Attach: {
        properties: {
          id: { type: 'integer', format: 'int64' },
          title: { type: 'string' },
          content: { type: 'string' },
          url: { type: 'string' },
          key: { type: 'string' },
          createdAt: { type: 'string', format: 'date' }
        },
        type: 'object'
      },
      Classstory: {
        properties: {
          id: { type: 'integer', format: 'int64' },
          classDate: { type: 'string', format: 'date' },
          title: { type: 'string' },
          content: { type: 'string' },
          classImg: { type: 'string' },
          key: { type: 'string' },
          createdAt: { type: 'string', format: 'date' }
        },
        type: 'object'
      },
      Essay: {
        properties: {
          id: { type: 'integer', format: 'int64' },
          bookName: { type: 'string' },
          bookAuthor: { type: 'string' },
          essayAuthor: { type: 'string' },
          title: { type: 'string' },
          url: { type: 'string' },
          content: { type: 'string' },
          createdAt: { type: 'string', format: 'date' }
        },
        type: 'object'
      },
      Qna: {
        properties: {
          id: { type: 'integer', format: 'int64' },
          title: { type: 'string' },
          content: { type: 'string' },
          email: { type: 'string' },
          createdAt: { type: 'string', format: 'date' }
        },
        type: 'object'
      },
      Schedule: {
        properties: {
          id: { type: 'integer', format: 'int64' },
          title: { type: 'string' },
          content: { type: 'string' },
          classId: { type: 'string' },
          classDate: { type: 'string', format: 'date' },
          location: { type: 'string' },
          attachUrl: { type: 'string' },
          attachTitle: { type: 'string' },
          createdAt: { type: 'string', format: 'date' }
        },
        type: 'object'
      },
      User: {
        properties: {
          id: { type: 'integer', format: 'int64' },
          classId: { type: 'string' },
          password: { type: 'string' },
          token: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          createdAt: { type: 'string', format: 'date' }
        },
        type: 'object'
      },
      New: {
        properties: {
          id: { type: 'integer', format: 'int64' },
          phoneNum: { type: 'string' },
          age: { type: 'integer', format: 'int64' },
          content: { type: 'string' },
          createdAt: { type: 'string', format: 'date' }
        },
        type: 'object'
      },
      Book: {
        properties: {
          title: { type: 'string' },
          image: { type: 'string' },
          author: { type: 'string' },
          description: { type: 'string' }
        }
      },
      AttachRegisterForm: {
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          attachFile: { type: 'object' }
        }
      },
      DeleteForm: {
        properties: {
          key: { type: 'string' }
        }
      },
      AuthRegisterForm: {
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
          classId: { type: 'string' },
          name: { type: 'string' }
        }
      },
      AuthLoginForm: {
        properties: {
          email: { type: 'string' },
          password: { type: 'string' }
        }
      },
      ClassstoryRegisterForm: {
        properties: {
          classDate: { type: 'string', format: 'date' },
          title: { type: 'string' },
          content: { type: 'string' },
          attachImg: { type: 'object' }
        }
      },
      EssayRegisterForm: {
        properties: {
          bookName: { type: 'string' },
          bookAuthor: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          url: { type: 'string' }
        }
      },
      QnaRegisterForm: {
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          email: { type: 'string' }
        }
      },
      AnswerForm: {
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          email: { type: 'string' }
        }
      },
      ScheduleRegisterForm: {
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          location: { type: 'string' },
          classId: { type: 'string' },
          classDate: { type: 'string', format: 'date' },
          attachId: { type: 'integer', format: 'int64' }
        }
      },
      NewRegisterForm: {
        properties: {
          phoneNum: { type: 'string' },
          age: { type: 'integer', format: 'int64' },
          content: { type: 'string' }
        }
      }
    }
  },
  apis: ['./routes/**/*.js'] // api 파일 위치들
};
