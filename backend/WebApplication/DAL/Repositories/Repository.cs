using System;
using DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
	{
		private readonly AppDbContext _context;

        public Repository(AppDbContext context)
		{
			_context = context;
		}
        public void Add(TEntity entity)
        {
            _context.Set<TEntity>().Add(entity);
        }

        public void DetachEntity(TEntity entity)
        {
            _context.Entry<TEntity>(entity).State = EntityState.Detached;
        }

        public async Task<List<TEntity>> GetAll()
        {
            return await _context.Set<TEntity>().ToListAsync();
        }

        public async Task<TEntity?> GetById(int id)
        {
            var result = await _context.Set<TEntity>().FindAsync(id);
            return result;
        }

        public void Remove(TEntity entity)
        {
            _context.Set<TEntity>().Remove(entity);
        }

        public Task SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }

        public void Update(TEntity entity)
        {
            _context.Set<TEntity>().Update(entity);
            _context.Entry(entity).State = EntityState.Modified;
        }
    }
}

