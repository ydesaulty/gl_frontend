import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

// Définition du formulaire pour le filtrage
const FilterForm = ({ onFilterChange }) => {

    // Initialisation du formulaire
    const { handleSubmit, control } = useForm();

    // Options pour la sélection des CSP
    const cspOptions = [
        { value: 'Employes', label: 'Employes' },
        { value: 'Commercants', label: 'Commercants' },
        { value: 'Etudiants', label: 'Etudiants' },
        { value: 'Agriculteurs', label: 'Agriculteurs' },
        { value: 'Retraites', label: 'Retraites' },
        { value: 'Autres', label: 'Autres' },
    ];

    // Options pour la sélection des catégories
    const categoryOptions = [
        { value: 1, label: 'Catégorie 1' },
        { value: 2, label: 'Catégorie 2' },
        { value: 3, label: 'Catégorie 3' },
        { value: 4, label: 'Catégorie 4' },
        { value: 5, label: 'Catégorie 5' },
    ];

    // Gestion d'envoi des filtres
    const onSubmit = (data) => {
        onFilterChange(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>CSP:</label>
                <Controller
                    name="csp"
                    control={control}
                    render={({ field }) => <Select {...field} options={cspOptions} isMulti />}
                />
            </div>
            <div>
                <label>Catégorie:</label>
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => <Select {...field} options={categoryOptions} isMulti />}
                />
            </div>
            <div>
                <label>Date de début:</label>
                <Controller
                    name="start_date"
                    control={control}
                    render={({ field }) => <input type="date" {...field} />}
                />
            </div>
            <div>
                <label>Date de fin:</label>
                <Controller
                    name="end_date"
                    control={control}
                    render={({ field }) => <input type="date" {...field} />}
                />
            </div>
            <div>
                <label>Date de début (comparaison):</label>
                <Controller
                    name="start_date_compare"
                    control={control}
                    render={({ field }) => <input type="date" {...field} />}
                />
            </div>
            <div>
                <label>Date de fin (comparaison):</label>
                <Controller
                    name="end_date_compare"
                    control={control}
                    render={({ field }) => <input type="date" {...field} />}
                />
            </div>
            <button type="submit">Filtrer</button>
        </form>
    );
};

export default FilterForm;
