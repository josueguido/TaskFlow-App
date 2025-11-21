# TaskFlow API - Documentación Swagger Completa

## Endpoints de Users

```yaml
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
}
```

## Endpoints de Tasks

```yaml
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
}
```

## Endpoints de Assignments

```yaml
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
}
```

## Instrucciones para añadir al archivo swagger.ts

1. **Copia cada sección de endpoints** y añádela antes del cierre de `paths: {}`
2. **Mantén la estructura JSON** correcta con comas entre endpoints
3. **Asegúrate de que todas las referencias a schemas** estén definidas en la sección `components.schemas`

## Endpoints pendientes por documentar

- `/api/status` - Status management
- `/api/task` - Task History
- `/api/roles` - Role management

¿Te gustaría que continúe con estos endpoints o prefieres que se añadan de forma gradual?
