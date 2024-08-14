import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const PlanEntrenamientoModal = ({ open, onClose, cliente, theme }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Plan de Entrenamiento de {cliente?.nombre} {cliente?.apellido}</DialogTitle>
            <DialogContent>
                {cliente?.rutina ? (
                    <div>
                        <h3>{cliente.rutina.nombre}</h3>
                        <p>{cliente.rutina.descripcion}</p>
                        <p><strong>Duración:</strong> {cliente.rutina.duracion}</p>
                        <p><strong>Fecha de Inicio:</strong> {new Date(cliente.rutina.fechaInicio).toLocaleDateString()}</p>
                        <p><strong>Meta:</strong> {cliente.rutina.meta}</p>
                        <hr />
                        {cliente.rutina.semanas && cliente.rutina.semanas.length > 0 ? (
                            cliente.rutina.semanas.map((semana, semanaIndex) => (
                                <div key={semana.id || semanaIndex}>
                                    <h4>Semana {semanaIndex + 1}: {semana.nombre}</h4>
                                    {semana.dias && semana.dias.length > 0 ? (
                                        semana.dias.map((dia, diaIndex) => (
                                            <div key={dia.id || diaIndex} style={{ marginLeft: '20px' }}>
                                                <h5>Día {diaIndex + 1}: {dia.nombre}</h5>
                                                {dia.sesiones && dia.sesiones.length > 0 ? (
                                                    dia.sesiones.map((sesion, sesionIndex) => (
                                                        <div key={sesion.id || sesionIndex} style={{ marginLeft: '40px' }}>
                                                            <h6>Sesión {sesionIndex + 1}: {sesion.nombre}</h6>
                                                            {sesion.actividades && sesion.actividades.length > 0 ? (
                                                                sesion.actividades.map((actividad, actividadIndex) => (
                                                                    <div key={actividad.name || actividadIndex} style={{ marginLeft: '60px' }}>
                                                                        <strong>Actividad {actividadIndex + 1}: {actividad.name}</strong>
                                                                        <p>Tipo: {actividad.type}</p>
                                                                        <p>Modo: {actividad.mode}</p>
                                                                        <p>Esquema: {actividad.scheme}</p>
                                                                        <p>Intensidad: {actividad.intensity}</p>
                                                                        <div>
                                                                            <h6>Ejercicios:</h6>
                                                                            <ul>
                                                                                {actividad.exercises && actividad.exercises.length > 0 ? (
                                                                                    actividad.exercises.map((ejercicio, ejercicioIndex) => (
                                                                                        <li key={ejercicio.nombre || ejercicioIndex}>
                                                                                            <strong>{ejercicio.nombre}</strong> - {ejercicio.tipo}
                                                                                            <p>Grupo Muscular: {ejercicio.grupoMuscular.join(', ')}</p>
                                                                                            {ejercicio.descripcion && <p>Descripción: {ejercicio.descripcion}</p>}
                                                                                            {ejercicio.equipo && <p>Equipo: {ejercicio.equipo}</p>}
                                                                                            <h6>Sets:</h6>
                                                                                            <ul>
                                                                                                {ejercicio.sets && ejercicio.sets.length > 0 ? (
                                                                                                    ejercicio.sets.map((set, setIndex) => (
                                                                                                        <li key={setIndex}>
                                                                                                            <p><strong>Set {set.set}:</strong> {set.reps} reps, {set.percent} de 1RM, {set.rest} descanso</p>
                                                                                                            {set.notes && <p>Notas: {set.notes}</p>}
                                                                                                            {set.adjusted_1RM && <p>1RM Ajustado: {set.adjusted_1RM}</p>}
                                                                                                        </li>
                                                                                                    ))
                                                                                                ) : (
                                                                                                    <p>No hay sets definidos.</p>
                                                                                                )}
                                                                                            </ul>
                                                                                        </li>
                                                                                    ))
                                                                                ) : (
                                                                                    <p>No hay ejercicios definidos.</p>
                                                                                )}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p>No hay actividades definidas.</p>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No hay sesiones definidas.</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No hay días definidos.</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No hay semanas definidas.</p>
                        )}
                    </div>
                ) : (
                    <p>No se ha encontrado una rutina para este cliente.</p>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PlanEntrenamientoModal;
