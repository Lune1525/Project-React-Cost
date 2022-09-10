import styles from './Project.module.css';
import {useParams} from 'react-router-dom';
import {useState, useEffect}  from 'react';
import Loading from './layout/Loading';
import Container from './layout/Container';
import ProjectForm from '../project/ProjectForm';
import Message from './layout/Message';
import ServiceForm from '../service/ServiceForm';
import {parse, v4 as uuidv4} from 'uuid';
import ServiceCard from '../service/ServiceCard';

function Project() {
    const {id} = useParams()
    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setshowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()
    const [services, setServices] = useState([])

    useEffect(() => {
       setMessage('')
       setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((resp) => resp.json())
            .then((data) => {
                setProject(data)
                setServices(data.services)
            }).catch(err => console.log(err))
        }, 300)
    }, [id])

    function removeService(id, cost) {
        const serviceUpdate = project.services.filter(
            (service) => service.id !== id
        )
        const projectUpdated = project
        projectUpdated.services = serviceUpdate
        projectUpdated.cost = parseFloat(projectUpdated.cost - parseFloat(cost))

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectUpdated)
        }).then((resp) => resp.json())
        .then((data) => {
            setProject(projectUpdated)
            setServices(serviceUpdate)
            setMessage('Serviço removido com sucesso!')
        }).catch(err => console.log(err))
    }

    function editPost(project) {
        if(project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor que o custo do projeto!')
            setType('error')
            return false;
        }
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        }).then((resp) => resp.json())
        .then((data) => {
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto atualizado!!')
            setType('success')
        }).catch(err => console.log(err))
    }

    function createService(project) {
        setMessage("")
        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()
        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
        if(newCost > parseFloat(project.budget)) {
            setMessage("Orçamento ultrapassado, verifique o valor do serviço!")
            setType("error")
            project.service.pop()
            return false
        }
        if(newCost < 0) {
            setMessage("Digite um valor valido!!")
            setType("error")
            return false
        }
        project.cost = newCost
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        }).then((resp) => resp.json())
        .then((data) => {
            setshowServiceForm(false)
        }).catch((err) => console(err))
    }

    function togleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function togleServicetForm() {
        setshowServiceForm(!showServiceForm)
    }

    return (
        <>
            {project.name ? (
             <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message type={type} msg={message}/>}
                    <div className={styles.details_container}>
                        <h1>Projeto: {project.name}</h1>
                        <button className={styles.btn} onClick={togleProjectForm}>
                            {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p>
                                    <span>Categoria:</span> {project.category.name}
                                </p>
                                <p>
                                    <span>Total de Orçamento:</span> R${project.budget}
                                </p>
                                <p>
                                    <span>Total Utilizado:</span> R${project.cost}
                                </p>
                            </div>
                            ) : (
                            <div className={styles.project_info}>
                                <ProjectForm handleSubmit={editPost} btnText="Concluir edição"
                                    projectData={project}/>
                            </div>
                        )}
                    </div>
                    <div className={styles.details_from_container}>
                        <h2>Adicione um serviço</h2>
                        <button className={styles.btn} onClick={togleServicetForm}>
                            {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                        </button>
                        <div className={styles.project_info}> 
                                {showServiceForm && (
                                    <ServiceForm 
                                        handleSubmit={createService}
                                        btnText="Adicionar serviço"
                                        projectData={project}
                                    />
                                )}
                        </div>
                    </div>
                    <h2>Serviços</h2>
                    <Container customClass="start">
                        {services.length > 0 &&
                            services.map((service) => (
                                <ServiceCard
                                    id={service.id}
                                    name={service.name}
                                    cost={service.cost}
                                    description={service.description}
                                    key={service.id}
                                    handleRemove={removeService}
                                />
                            ))
                        }
                        {services.length === 0 && <p>Não há serviços cadastrados</p>}
                    </Container>
                </Container>
             </div>
            ) : (
                 <Loading />
            )}
        </>
    )
}

export default Project