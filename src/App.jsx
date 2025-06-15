import Gallery from './components/Gallery';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <main className="flex flex-col items-center justify-center">
        <ErrorBoundary>
          <Gallery />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;