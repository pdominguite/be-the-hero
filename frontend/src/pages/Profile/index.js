import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom'
import {FiPower, FiTrash2} from 'react-icons/fi';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg'

import './styles.css';

export default function Profile() {
    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    const history = useHistory();

    const [incidents, setIncidents] = useState([]);
    useEffect(() => {
        api.get('profile', {
            headers : {
                Authorization: ongId
            }
        }).then(res => {
            setIncidents(res.data);
        })
    }, [ongId]);

    async function handleDeleteIncident (id) {
        try {
            await api.delete(`incidents/${id}`, {
                headers : {
                    Authorization: ongId
                }
            });
            //Return all the incidents but the one we deleted, using filter
            setIncidents(incidents.filter(incident => incident.id !== id));
        } catch (err) {
            alert('Error deleting this incident. Try again.');
        }
    }

    function handleLogout(e) {
        localStorage.clear();
        history.push('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero!"/>
                <span>Welcome, {ongName}</span>
                <Link className='button' to='/incidents/new'>Register a new incident</Link>
                <button onClick={() => handleLogout()} type='button'>
                    <FiPower size={18} color="#E02041"/>
                </button>
            </header>
            <h1>Registered incidents</h1>
            <ul>
                {
                    incidents.map(incident => (
                        <li key={incident.id}>
                            <strong>INCIDENT:</strong>
                            <p>{incident.title}</p>
                            <strong>DESCRIPTION:</strong>
                            <p>{incident.description}</p>
                            <strong>VALUE:</strong>
                            <p>{Intl.NumberFormat('en', {style: 'currency', currency: 'USD'}).format(incident.value)}</p>
                            <button onClick={() => handleDeleteIncident(incident.id)} type='button'>
                                <FiTrash2 size={20} color='#a8a8b3'/>
                            </button>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}