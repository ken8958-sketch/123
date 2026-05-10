# Security Specification for 聚茗坊 Tea Shop

## Data Invariants
- An order must have at least one item.
- An order's `totalAmount` must be the sum of its items' prices multiplied by quantities.
- A user can only access their own orders.
- Only admins can update the status of an order.
- Products and categories are publicly visible but only editable by admins.

## The Dirty Dozen Payloads
1. Attempting to create a user profile with role: 'admin' (Identity Spoofing)
2. Creating an order with totalAmount: 0 but containing items (State Shortcutting)
3. Reading all orders without being an admin (Privacy Leak)
4. Deleting a product as a customer (Resource Poisoning)
5. Updating an order status to 'completed' as a customer (State Shortcutting)
6. Injecting a 2MB string into product name (Denial of Wallet)
7. Creating a category without a name (Schema Violation)
8. Setting order status to 'making' during creation (State Shortcutting)
9. Modifying someone else's order (Identity Spoofing)
10. Creating a user profile for a different UID (Identity Spoofing)
11. Reading the 'users' collection items to find emails (PII Leak)
12. Updating product prices to 0 as an unauthorized user (Resource Poisoning)

## The Safeguards
- `isValidUser`: Checks email format and prevents self-assignment of 'admin' role.
- `isValidOrder`: Validates items list and initial 'pending' status.
- `isAdmin`: Checks if user UID exists in `admins` whitelist or has admin record.
