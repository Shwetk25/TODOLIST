import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ListTodo, Calendar as CalendarIcon } from 'lucide-react';
import { addMonths, subMonths, isToday, isTomorrow, isPast, isFuture, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import TodoFilter from './components/TodoFilter';
import Celebration from './components/Celebration';
import EmptyState from './components/EmptyState';
import Calendar from './components/Calendar';
import ReminderNotification from './components/ReminderNotification';
import { Todo, FilterType } from './types';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      }));
    }
    return [];
  });
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reminderTodo, setReminderTodo] = useState<Todo | null>(null);
  
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  
  // Check for reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const todosWithReminders = todos.filter(todo => 
        todo.reminder && 
        !todo.completed && 
        !todo.reminderSent &&
        todo.dueDate && 
        (isToday(todo.dueDate) || isTomorrow(todo.dueDate))
      );
      
      if (todosWithReminders.length > 0) {
        // Show the first reminder
        setReminderTodo(todosWithReminders[0]);
        
        // Mark as sent
        setTodos(prevTodos => 
          prevTodos.map(todo => 
            todo.id === todosWithReminders[0].id 
              ? { ...todo, reminderSent: true } 
              : todo
          )
        );
      }
    };
    
    // Check immediately and then every minute
    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    
    return () => clearInterval(interval);
  }, [todos]);
  
  const addTodo = (text: string, dueDate?: Date, reminder?: boolean) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
      dueDate,
      reminder,
      reminderSent: false
    };
    setTodos([...todos, newTodo]);
  };
  
  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        const newCompleted = !todo.completed;
        if (newCompleted) {
          // Only show celebration when marking as completed
          setShowCelebration(true);
        }
        return { ...todo, completed: newCompleted };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };
  
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const editTodo = (id: string, newText: string) => {
    setTodos(
      todos.map(todo => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };
  
  const updateDueDate = (id: string, dueDate?: Date) => {
    setTodos(
      todos.map(todo => (todo.id === id ? { ...todo, dueDate } : todo))
    );
  };
  
  const toggleReminder = (id: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id 
          ? { ...todo, reminder: !todo.reminder, reminderSent: false } 
          : todo
      )
    );
  };
  
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };
  
  const handleDateClick = (date: Date) => {
    setFilter('all');
    // Filter todos for this date
    const todosForDate = todos.filter(todo => 
      todo.dueDate && 
      isWithinInterval(todo.dueDate, {
        start: startOfDay(date),
        end: endOfDay(date)
      })
    );
    
    if (todosForDate.length > 0) {
      // Highlight these todos somehow or show a modal
      console.log('Todos for', date, todosForDate);
    }
  };
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    if (filter === 'upcoming') {
      return !todo.completed && todo.dueDate && isFuture(todo.dueDate);
    }
    return true;
  });
  
  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;
  const upcomingCount = todos.filter(todo => 
    !todo.completed && todo.dueDate && (isToday(todo.dueDate) || isTomorrow(todo.dueDate))
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <Celebration 
        show={showCelebration} 
        onComplete={() => setShowCelebration(false)} 
      />
      
      <ReminderNotification
        todo={reminderTodo}
        onClose={() => setReminderTodo(null)}
      />
      
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-2"
          >
            <ListTodo size={32} className="text-yellow-600 mr-2" />
            <h1 className="text-3xl font-bold text-yellow-500">My To Do List</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-yellow-600"
          >
           <b> Organize your tasks, celebrate your achievements</b>
          </motion.p>
        </header>
        
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              showCalendar 
                ? 'bg-yellow-600 text-white' 
                : 'bg-white text-yellow-600 hover:bg-yellow-70'
            }`}
          >
            <CalendarIcon size={18} className="mr-2" />
            {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
          </button>
        </div>
        
        {showCalendar && (
          <Calendar
            todos={todos}
            currentMonth={currentMonth}
            onDateClick={handleDateClick}
            onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
            onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
          />
        )}
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <TodoForm addTodo={addTodo} />
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-1 text-sm text-yellow-600">
              <span className="font-medium">{activeCount}</span>
              <span>active</span>
              <span className="mx-1">•</span>
              <span className="font-medium">{completedCount}</span>
              <span>completed</span>
              {upcomingCount > 0 && (
                <>
                  <span className="mx-1">•</span>
                  <span className="font-medium text-yellow-500">{upcomingCount}</span>
                  <span className="text-yellow-500">upcoming</span>
                </>
              )}
            </div>
          </div>
          
          <TodoFilter
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
            completedCount={completedCount}
            upcomingCount={upcomingCount}
          />
          
          {todos.length > 0 ? (
            <ul className="mt-4">
              <AnimatePresence>
                {filteredTodos.length > 0 ? (
                  filteredTodos.map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      toggleTodo={toggleTodo}
                      deleteTodo={deleteTodo}
                      editTodo={editTodo}
                      toggleReminder={toggleReminder}
                      updateDueDate={updateDueDate}
                    />
                  ))
                ) : (
                  <EmptyState 
                    type={filter === 'completed' && activeCount > 0 ? 'empty' : 'completed'} 
                  />
                )}
              </AnimatePresence>
            </ul>
          ) : (
            <EmptyState type="empty" />
          )}
        </motion.div>
        
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-sm"
        >
          <p>Add due dates to tasks and set reminders to stay on track!</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;