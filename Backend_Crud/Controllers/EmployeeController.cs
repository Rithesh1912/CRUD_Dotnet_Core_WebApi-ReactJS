using Backend_Crud.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.OpenApi.Writers;

namespace Backend_Crud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeContext _employeeContext;
        public EmployeeController(EmployeeContext employeeContext)
        {
            _employeeContext = employeeContext;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployee()
        {
            if (_employeeContext.Employees == null)
            {
                return NotFound();
            }
            return await _employeeContext.Employees.ToListAsync();
        }


        [HttpGet("{id}")]

        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            if (_employeeContext.Employees == null)
            {
                return NotFound();
            }
            var employee = _employeeContext.Employees.Find(id);
            if (employee == null)
            {
                return NotFound();
            }
            return employee;

        }


        [HttpPost]
        public async Task<ActionResult<Employee>> postEmployee(Employee employee)
        {
            _employeeContext.Employees.Add(employee);
            await _employeeContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.ID }, employee);
        }


        [HttpPut("{id}")]
        public async Task<ActionResult<Employee>> PutEmployee(int id, Employee employee)
        {
            // Check if the ID in the URL matches the ID in the employee object
            if (id != employee.ID)
            {
                return BadRequest("Employee ID mismatch.");
            }

            // Check if the employee exists
            var existingEmployee = await _employeeContext.Employees.FindAsync(id);
            if (existingEmployee == null)
            {
                return NotFound("Employee not found.");
            }

            // Update the employee properties
            existingEmployee.Name = employee.Name;
            existingEmployee.age = employee.age;
            existingEmployee.IsActive = employee.IsActive;

            // Mark the entity as modified
            _employeeContext.Entry(existingEmployee).State = EntityState.Modified;

            try
            {
                await _employeeContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict("Concurrency conflict occurred while updating the employee.");
            }

            return Ok(existingEmployee); // Return the updated employee
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult>DeleteEmployee(int id)
        {
            if(_employeeContext.Employees==null)
            {
                return NotFound();
            }
            var employee = await _employeeContext.Employees.FindAsync(id);
            if(employee == null)
            {
                return NotFound();
            }
            _employeeContext.Employees.Remove(employee);
            await _employeeContext.SaveChangesAsync();

            return Ok();
        }
    }
}
