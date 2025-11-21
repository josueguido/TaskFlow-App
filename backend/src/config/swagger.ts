import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'TaskFlow API',
    version: '1.0.0',
    description: 'A robust and scalable backend API for TaskFlow application built with Node.js, TypeScript, Express, and PostgreSQL',
    contact: {
      name: 'Josue Guido',
      email: 'josuguido@gmail.com',
      url: 'https://github.com/josueguido'
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https:',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
          id: {
            type: 'integer',
            description: 'User ID',
            example: 1
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'user@example.com'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'User password',
            example: 'password123'
          },
          name: {
            type: 'string',
            description: 'User full name',
            example: 'John Doe'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            description: 'User role',
            example: 'user'
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        }
      },
      Task: {
        type: 'object',
        required: ['title', 'description'],
        properties: {
          id: {
            type: 'integer',
            description: 'Task ID',
            example: 1
          },
          title: {
            type: 'string',
            description: 'Task title',
            example: 'Complete project documentation'
          },
          description: {
            type: 'string',
            description: 'Task description',
            example: 'Write comprehensive documentation for the TaskFlow project'
          },
          status_id: {
            type: 'integer',
            description: 'Status ID',
            example: 1
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            description: 'Task priority',
            example: 'high'
          },
          created_by: {
            type: 'integer',
            description: 'User ID who created the task',
            example: 1
          },
          due_date: {
            type: 'string',
            format: 'date-time',
            description: 'Task due date'
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        }
      },
      Status: {
        type: 'object',
        required: ['name'],
        properties: {
          id: {
            type: 'integer',
            description: 'Status ID',
            example: 1
          },
          name: {
            type: 'string',
            description: 'Status name',
            example: 'To Do'
          },
          description: {
            type: 'string',
            description: 'Status description',
            example: 'Task is pending to be started'
          },
          color: {
            type: 'string',
            description: 'Status color in hex format',
            example: '#FF0000'
          },
          is_active: {
            type: 'boolean',
            description: 'Whether the status is active',
            example: true
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        }
      },
      Assignment: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Assignment ID',
            example: 1
          },
          task_id: {
            type: 'integer',
            description: 'Task ID',
            example: 1
          },
          user_id: {
            type: 'integer',
            description: 'User ID',
            example: 1
          },
          assigned_at: {
            type: 'string',
            format: 'date-time',
            description: 'Assignment timestamp'
          }
        }
      },
      TaskHistory: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'History ID',
            example: 1
          },
          task_id: {
            type: 'integer',
            description: 'Task ID',
            example: 1
          },
          user_id: {
            type: 'integer',
            description: 'User ID who made the change',
            example: 1
          },
          action: {
            type: 'string',
            description: 'Action performed',
            example: 'status_changed'
          },
          field_name: {
            type: 'string',
            description: 'Field that was changed',
            example: 'status_id'
          },
          old_value: {
            type: 'string',
            description: 'Previous value',
            example: '1'
          },
          new_value: {
            type: 'string',
            description: 'New value',
            example: '2'
          },
          description: {
            type: 'string',
            description: 'Human-readable description',
            example: 'Status changed from To Do to In Progress'
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
          }
        }
      },
      Role: {
        type: 'object',
        required: ['name'],
        properties: {
          id: {
            type: 'integer',
            description: 'Role ID',
            example: 1
          },
          name: {
            type: 'string',
            description: 'Role name',
            example: 'admin'
          },
          description: {
            type: 'string',
            description: 'Role description',
            example: 'Administrator with full access'
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error'
          },
          message: {
            type: 'string',
            example: 'Error message'
          },
          stack: {
            type: 'string',
            example: 'Error stack trace'
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com'
          },
          password: {
            type: 'string',
            example: 'password123'
          }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          },
          user: {
            $ref: '#/components/schemas/User'
          }
        }
      },
      AssignUsersRequest: {
        type: 'object',
        required: ['userIds'],
        properties: {
          userIds: {
            type: 'array',
            items: {
              type: 'integer'
            },
            example: [1, 2, 3]
          }
        }
      },
      Project: {
        type: 'object',
        required: ['business_id', 'name'],
        properties: {
          id: {
            type: 'integer',
            description: 'Project ID',
            example: 1
          },
          business_id: {
            type: 'integer',
            description: 'Business ID that owns this project',
            example: 1
          },
          name: {
            type: 'string',
            description: 'Project name',
            example: 'Website Redesign'
          },
          description: {
            type: 'string',
            description: 'Project description',
            example: 'Complete redesign of company website with modern UI/UX'
          },
          status: {
            type: 'string',
            enum: ['planning', 'active', 'completed', 'on-hold', 'cancelled'],
            description: 'Project status',
            example: 'active'
          },
          start_date: {
            type: 'string',
            format: 'date',
            description: 'Project start date',
            example: '2024-01-15'
          },
          end_date: {
            type: 'string',
            format: 'date',
            description: 'Project end date',
            example: '2024-06-15'
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        }
      },
      CreateProjectRequest: {
        type: 'object',
        required: ['business_id', 'name'],
        properties: {
          business_id: {
            type: 'integer',
            description: 'Business ID that owns this project',
            example: 1
          },
          name: {
            type: 'string',
            description: 'Project name',
            example: 'Website Redesign'
          },
          description: {
            type: 'string',
            description: 'Project description',
            example: 'Complete redesign of company website with modern UI/UX'
          },
          status: {
            type: 'string',
            enum: ['planning', 'active', 'completed', 'on-hold', 'cancelled'],
            description: 'Project status',
            example: 'planning'
          },
          start_date: {
            type: 'string',
            format: 'date',
            description: 'Project start date',
            example: '2024-01-15'
          },
          end_date: {
            type: 'string',
            format: 'date',
            description: 'Project end date',
            example: '2024-06-15'
          }
        }
      },
      UpdateProjectRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Project name',
            example: 'Website Redesign v2'
          },
          description: {
            type: 'string',
            description: 'Project description',
            example: 'Updated project scope with additional features'
          },
          status: {
            type: 'string',
            enum: ['planning', 'active', 'completed', 'on-hold', 'cancelled'],
            description: 'Project status',
            example: 'active'
          },
          start_date: {
            type: 'string',
            format: 'date',
            description: 'Project start date',
            example: '2024-01-15'
          },
          end_date: {
            type: 'string',
            format: 'date',
            description: 'Project end date',
            example: '2024-06-15'
          }
        }
      },
      ProjectStats: {
        type: 'object',
        properties: {
          total: {
            type: 'integer',
            description: 'Total number of projects',
            example: 15
          },
          byStatus: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'active'
                },
                count: {
                  type: 'integer',
                  example: 8
                }
              }
            }
          }
        }
      }
    }
  },
  paths: {
    '/': {
      get: {
        summary: 'API Health Check',
        description: 'Returns basic information about the TaskFlow API',
        tags: ['General'],
        responses: {
          200: {
            description: 'API is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'TaskFlow API running with PostgreSQL!'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        description: 'Create a new user account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'user@example.com'
                  },
                  password: {
                    type: 'string',
                    minLength: 6,
                    example: 'password123'
                  },
                  name: {
                    type: 'string',
                    example: 'John Doe'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse'
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          409: {
            description: 'Conflict - Email already exists',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'User login',
        description: 'Authenticate user and return JWT token',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse'
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid credentials',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid email or password',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        summary: 'User logout',
        description: 'Logout user and invalidate token',
        tags: ['Authentication'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Logout successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Logged out successfully'
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid or missing token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/refresh': {
      post: {
        summary: 'Refresh JWT token',
        description: 'Get a new JWT token using refresh token',
        tags: ['Authentication'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Token refreshed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid or expired refresh token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/users': {
      get: {
        summary: 'Get all users',
        description: 'Retrieve all users (Admin only)',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Users retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          403: {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new user',
        description: 'Create a new user account',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'newuser@example.com'
                  },
                  password: {
                    type: 'string',
                    minLength: 6,
                    example: 'password123'
                  },
                  name: {
                    type: 'string',
                    example: 'Jane Doe'
                  },
                  role: {
                    type: 'string',
                    enum: ['user', 'admin'],
                    example: 'user'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          409: {
            description: 'Conflict - Email already exists',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        summary: 'Get user by ID',
        description: 'Retrieve a specific user by their ID',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'User retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update user',
        description: 'Update user information',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'updated@example.com'
                  },
                  name: {
                    type: 'string',
                    example: 'Updated Name'
                  },
                  role: {
                    type: 'string',
                    enum: ['user', 'admin'],
                    example: 'user'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Delete user',
        description: 'Delete a user account (Admin only)',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'User deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'User deleted successfully'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          403: {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/tasks': {
      get: {
        summary: 'Get all tasks',
        description: 'Retrieve all tasks with optional filtering',
        tags: ['Tasks'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'status_id',
            in: 'query',
            description: 'Filter by status ID',
            schema: {
              type: 'integer',
              example: 1
            }
          },
          {
            name: 'priority',
            in: 'query',
            description: 'Filter by priority',
            schema: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              example: 'high'
            }
          },
          {
            name: 'assigned_to',
            in: 'query',
            description: 'Filter by assigned user ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Tasks retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Task'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new task',
        description: 'Create a new task',
        tags: ['Tasks'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description'],
                properties: {
                  title: {
                    type: 'string',
                    example: 'Complete project documentation'
                  },
                  description: {
                    type: 'string',
                    example: 'Write comprehensive documentation for the TaskFlow project'
                  },
                  status_id: {
                    type: 'integer',
                    example: 1
                  },
                  priority: {
                    type: 'string',
                    enum: ['low', 'medium', 'high'],
                    example: 'high'
                  },
                  due_date: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-12-31T23:59:59Z'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Task created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task'
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/tasks/{id}': {
      get: {
        summary: 'Get task by ID',
        description: 'Retrieve a specific task by its ID',
        tags: ['Tasks'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Task ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Task retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task'
                }
              }
            }
          },
          404: {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update task',
        description: 'Update an existing task',
        tags: ['Tasks'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Task ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    example: 'Updated task title'
                  },
                  description: {
                    type: 'string',
                    example: 'Updated task description'
                  },
                  status_id: {
                    type: 'integer',
                    example: 2
                  },
                  priority: {
                    type: 'string',
                    enum: ['low', 'medium', 'high'],
                    example: 'medium'
                  },
                  due_date: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-12-31T23:59:59Z'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Task updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task'
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          404: {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Delete task',
        description: 'Delete an existing task',
        tags: ['Tasks'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Task ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Task deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Task deleted successfully'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/status': {
      get: {
        summary: 'Get all statuses',
        description: 'Retrieve all available task statuses',
        tags: ['Status'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Statuses retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Status'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new status',
        description: 'Create a new task status',
        tags: ['Status'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: {
                    type: 'string',
                    example: 'In Review'
                  },
                  description: {
                    type: 'string',
                    example: 'Task is being reviewed'
                  },
                  color: {
                    type: 'string',
                    example: '#FFA500'
                  },
                  is_active: {
                    type: 'boolean',
                    example: true
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Status created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Status'
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/status/{id}': {
      get: {
        summary: 'Get status by ID',
        description: 'Retrieve a specific status by its ID',
        tags: ['Status'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Status ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Status retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Status'
                }
              }
            }
          },
          404: {
            description: 'Status not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update status',
        description: 'Update an existing status',
        tags: ['Status'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Status ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Updated Status Name'
                  },
                  description: {
                    type: 'string',
                    example: 'Updated status description'
                  },
                  color: {
                    type: 'string',
                    example: '#00FF00'
                  },
                  is_active: {
                    type: 'boolean',
                    example: false
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Status updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Status'
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          404: {
            description: 'Status not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Delete status',
        description: 'Delete an existing status',
        tags: ['Status'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Status ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Status deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Status deleted successfully'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Status not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/assignments': {
      get: {
        summary: 'Get all assignments',
        description: 'Retrieve all task assignments',
        tags: ['Assignments'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Assignments retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Assignment'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/assignments/task/{taskId}': {
      get: {
        summary: 'Get assignments by task ID',
        description: 'Retrieve all assignments for a specific task',
        tags: ['Assignments'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            description: 'Task ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Task assignments retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Assignment'
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid task ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Remove all assignments from task',
        description: 'Remove all user assignments from a specific task',
        tags: ['Assignments'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            description: 'Task ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'All assignments removed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'All assignments removed successfully'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/assignments/task/{taskId}/assign': {
      post: {
        summary: 'Assign users to task',
        description: 'Assign multiple users to a specific task',
        tags: ['Assignments'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            description: 'Task ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AssignUsersRequest'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Users assigned successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Assignment'
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/assignments/task/{taskId}/user/{userId}': {
      get: {
        summary: 'Check if user is assigned to task',
        description: 'Check if a specific user is assigned to a specific task',
        tags: ['Assignments'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            description: 'Task ID',
            schema: {
              type: 'integer',
              example: 1
            }
          },
          {
            name: 'userId',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Assignment status retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isAssigned: {
                      type: 'boolean',
                      example: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Remove user assignment from task',
        description: 'Remove a specific user assignment from a task',
        tags: ['Assignments'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            description: 'Task ID',
            schema: {
              type: 'integer',
              example: 1
            }
          },
          {
            name: 'userId',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Assignment removed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Assignment removed successfully'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Assignment not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/task/{taskId}/history': {
      get: {
        summary: 'Get task history',
        description: 'Retrieve the complete history of changes for a specific task',
        tags: ['Task History'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            description: 'Task ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Task history retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/TaskHistory'
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid task ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          404: {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Add history entry',
        description: 'Add a new entry to the task history',
        tags: ['Task History'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            description: 'Task ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['action', 'description'],
                properties: {
                  action: {
                    type: 'string',
                    example: 'status_changed'
                  },
                  field_name: {
                    type: 'string',
                    example: 'status_id'
                  },
                  old_value: {
                    type: 'string',
                    example: '1'
                  },
                  new_value: {
                    type: 'string',
                    example: '2'
                  },
                  description: {
                    type: 'string',
                    example: 'Status changed from To Do to In Progress'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'History entry created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TaskHistory'
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          404: {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/roles': {
      get: {
        summary: 'Get all roles',
        description: 'Retrieve all user roles',
        tags: ['Roles'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Roles retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Role'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new role',
        description: 'Create a new user role (Admin only)',
        tags: ['Roles'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: {
                    type: 'string',
                    example: 'manager'
                  },
                  description: {
                    type: 'string',
                    example: 'Project manager with team oversight permissions'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Role created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Role'
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          403: {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/roles/{id}': {
      get: {
        summary: 'Get role by ID',
        description: 'Retrieve a specific role by its ID',
        tags: ['Roles'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Role ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Role retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Role'
                }
              }
            }
          },
          404: {
            description: 'Role not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update role',
        description: 'Update an existing role (Admin only)',
        tags: ['Roles'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Role ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'updated_role'
                  },
                  description: {
                    type: 'string',
                    example: 'Updated role description'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Role updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Role'
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          404: {
            description: 'Role not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          403: {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Delete role',
        description: 'Delete an existing role (Admin only)',
        tags: ['Roles'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Role ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Role deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Role deleted successfully'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Role not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          403: {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/projects/business/{businessId}': {
      get: {
        summary: 'Get projects by business',
        description: 'Retrieve all projects for a specific business with optional filtering',
        tags: ['Projects'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'businessId',
            in: 'path',
            required: true,
            description: 'Business ID',
            schema: {
              type: 'integer',
              example: 1
            }
          },
          {
            name: 'status',
            in: 'query',
            required: false,
            description: 'Filter by project status',
            schema: {
              type: 'string',
              enum: ['planning', 'active', 'completed', 'on-hold', 'cancelled']
            }
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            description: 'Maximum number of results',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 10
            }
          },
          {
            name: 'offset',
            in: 'query',
            required: false,
            description: 'Number of results to skip',
            schema: {
              type: 'integer',
              minimum: 0,
              example: 0
            }
          }
        ],
        responses: {
          200: {
            description: 'Projects retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Projects retrieved successfully'
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Project'
                      }
                    },
                    meta: {
                      type: 'object',
                      properties: {
                        businessId: {
                          type: 'integer',
                          example: 1
                        },
                        count: {
                          type: 'integer',
                          example: 5
                        },
                        limit: {
                          type: 'integer',
                          example: 10
                        },
                        offset: {
                          type: 'integer',
                          example: 0
                        },
                        status: {
                          type: 'string',
                          example: 'active'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid business ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid or missing token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/projects/business/{businessId}/stats': {
      get: {
        summary: 'Get project statistics',
        description: 'Get project statistics for a specific business',
        tags: ['Projects'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'businessId',
            in: 'path',
            required: true,
            description: 'Business ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Project statistics retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Project statistics retrieved successfully'
                    },
                    data: {
                      $ref: '#/components/schemas/ProjectStats'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid business ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid or missing token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/projects/{id}': {
      get: {
        summary: 'Get project by ID',
        description: 'Retrieve a specific project by its ID',
        tags: ['Projects'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Project ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Project retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Project retrieved successfully'
                    },
                    data: {
                      $ref: '#/components/schemas/Project'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid project ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          404: {
            description: 'Project not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid or missing token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update project',
        description: 'Update an existing project',
        tags: ['Projects'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Project ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateProjectRequest'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Project updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Project updated successfully'
                    },
                    data: {
                      $ref: '#/components/schemas/Project'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          404: {
            description: 'Project not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid or missing token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Delete project',
        description: 'Delete an existing project',
        tags: ['Projects'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Project ID',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Project deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Project deleted successfully'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid project ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          404: {
            description: 'Project not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid or missing token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/projects': {
      post: {
        summary: 'Create project',
        description: 'Create a new project',
        tags: ['Projects'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateProjectRequest'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Project created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Project created successfully'
                    },
                    data: {
                      $ref: '#/components/schemas/Project'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid or missing token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    }
  }
};

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
