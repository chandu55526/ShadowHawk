import { Server } from 'socket.io';

export const setupThreatDetection = (io: Server, db: any) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle threat detection
    socket.on('detectThreat', (data) => {
      const { url, type, details } = data;
      
      // Create threat record
      const threat = {
        id: Date.now().toString(),
        url,
        type,
        details,
        timestamp: new Date(),
        status: 'detected'
      };

      db.threats.push(threat);

      // Broadcast threat to all connected clients
      io.emit('threatDetected', threat);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}; 