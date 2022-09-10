import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from './components/pages/Home';
import Company from './components/pages/Company';
import Contact from './components/pages/Contact';
import NewProject from './components/pages/NewProject';
import Container from './components/pages/layout/Container';
import Navbar from './components/pages/layout/Navbar';
import Footer from './components/pages/layout/Footer';
import Projects from './components/pages/Projects';
import Project from './components/pages/Project';

function App() {
  return (
    <Router>
      <Navbar />
      <Container customClass="min-height">
        <Routes>
          <Route exact path="/"
            element={<Home />}>
          </Route>
          <Route path="/company"
            element={<Company />}>
          </Route>
          <Route path="/projects"
            element={<Projects />}>
          </Route>
          <Route path="/contact"
            element={<Contact />}>
          </Route>
          <Route path="/newProject"
            element={<NewProject />}>
          </Route>
          <Route path="/project/:id"
            element={<Project />}>
          </Route>
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
