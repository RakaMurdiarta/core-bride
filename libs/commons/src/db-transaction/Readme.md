# DB Transaction: README

## Description
In this project, there are two implementations for managing database transactions: one using an **Interceptor** and the other using **Manual DB Transaction**. Both implementations ensure that all operations involving the database are handled within a single transaction, but they are used in different contexts.

## 1. `db-transaction.interceptor.ts`

**Purpose**: This file is responsible for automatically managing database transactions using the **NestJS Interceptor**. The interceptor is used to **manage transactions at the HTTP request level**, particularly when transactions are related to operations that occur outside of a job queue.

### Use Cases
- **Used when there is no job queue** or direct repository/database calls within your **service**.
- The transaction is initiated at the HTTP request level, where each request will start a new transaction. If there are database operations within it, the transaction will be managed automatically.
- If an error occurs or the request fails, the transaction will be rolled back automatically.

### How It Works
1. The interceptor creates a **QueryRunner** and starts a transaction when the request is received.
2. The transaction will be committed if all operations are successful.
3. If an error occurs, the transaction will be rolled back.
4. After the transaction completes (whether successful or failed), the **QueryRunner** will be released to avoid connection leakage.

### Usage
- **Automatic transaction management for HTTP requests** without needing to write explicit transaction code inside the service or controller.
- Provides **consistent transaction handling** at the application level by relying on the interceptor.

---

### Example Usage in Controller

You can apply the **`TransactionInterceptor`** to a specific route handler or the entire controller. Below is an example of how to apply the interceptor to a specific route handler:

#### Controller Example:
```typescript
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { TransactionInterceptor } from './path/to/db-transaction.interceptor'; // Update with actual path
import { MyService } from './my.service'; // Update with actual service

@Controller('my-controller')
export class MyController {
  constructor(private readonly myService: MyService) {}

  @Get('process')
  @UseInterceptors(TransactionInterceptor) // Apply the interceptor here
  async processTransaction() {
    // Inside this method, the transaction will be handled automatically by the interceptor.
    await this.myService.performDatabaseOperation();
    return { message: 'Operation completed successfully' };
    }
  }
```

## 2. `job-db-transaction.ts`

**Purpose**: This file is used to **manually manage database transactions** within the context of a **job queue**. This transaction management is used when a job requires access to the repository/database.

### Use Cases
- **Used when database operations occur within a job queue**, requiring **explicit transaction management**.
- Transactions are handled **manually** within the job being processed in the queue.
- If an error occurs during job processing, the transaction will be rolled back.

### How It Works
1. The transaction is manually started within the job being processed.
2. A QueryRunner is used to execute database operations within the job.
3. If all operations are successful, the transaction will be committed.
4. If an error occurs, the transaction will be rolled back.

### Notes
1. Dont add @UseInterceptors(TransactionInterceptor) on controller if used this

### Usage
- **Manual transaction management** within job queues to ensure database operations are executed within the scope of a specific job.
- Provides greater control over transaction management, particularly in the context of background jobs.

---

## Differences Between the Two

| **Feature**                | **`db-transaction.interceptor.ts`**                        | **`job-db-transaction.ts`**                               |
|----------------------------|------------------------------------------------------------|--------------------------------------------------------|
| **Usage**                  | Used at the HTTP request level (Without job queue)          | Used within job queues to manage transactions          |
| **Scope**                   | Manages transactions for HTTP requests automatically       | Manual transaction handling within job processing       |
| **Auto/Manual Commit**      | Auto commit or rollback based on the request status        | Manual commit or rollback within the job                |
| **Query Runner**            | Managed automatically by the interceptor for each request | Managed explicitly within each job being processed      |

---

## When to Use Each?

- Use **`db-transaction.interceptor.ts`** when you want to **automatically manage transactions for each request** (e.g., API requests or other HTTP operations) without needing to write explicit transaction code.
- Use **`job-db-transaction.ts`** when working with **job queues** (e.g., managing transactions within jobs running in the background) and need to ensure transactions only apply to specific jobs.

---

## Summary
- **`db-transaction.interceptor.ts`**: Ideal for automatic transaction management in each HTTP request.
- **`job-db-transaction.ts`**: Used for manual transaction management within the context of job queues.

If you have any further questions or need additional clarification, feel free to ask!
