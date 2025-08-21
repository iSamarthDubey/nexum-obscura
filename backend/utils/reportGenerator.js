const Log = require('../models/Log');
const Connection = require('../models/Connection');

// Generate comprehensive report
async function generateReport({ startDate, endDate, reportType, includeRecommendations = true }) {
  try {
    const filter = {
      timestamp: { $gte: startDate, $lte: endDate }
    };

    // Basic statistics
    const totalLogs = await Log.countDocuments(filter);
    const suspiciousActivities = await Log.countDocuments({ 
      ...filter, 
      suspicionScore: { $gte: 70 } 
    });
    const criticalThreats = await Log.countDocuments({ 
      ...filter, 
      suspicionScore: { $gte: 90 } 
    });

    // Top source IPs by activity
    const topSourceIPs = await Log.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$sourceIP',
          count: { $sum: 1 },
          avgSuspicion: { $avg: '$suspicionScore' },
          maxSuspicion: { $max: '$suspicionScore' },
          totalBytes: { $sum: '$bytes' }
        }
      },
      {
        $project: {
          ip: '$_id',
          count: 1,
          avgSuspicion: { $round: ['$avgSuspicion', 2] },
          maxSuspicion: 1,
          totalBytes: 1,
          riskLevel: {
            $switch: {
              branches: [
                { case: { $gte: ['$avgSuspicion', 90] }, then: 'CRITICAL' },
                { case: { $gte: ['$avgSuspicion', 70] }, then: 'HIGH' },
                { case: { $gte: ['$avgSuspicion', 50] }, then: 'MEDIUM' },
              ],
              default: 'LOW'
            }
          }
        }
      },
      { $sort: { avgSuspicion: -1, count: -1 } },
      { $limit: 10 }
    ]);

    // Top destination IPs by activity
    const topDestinationIPs = await Log.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$destinationIP',
          count: { $sum: 1 },
          avgSuspicion: { $avg: '$suspicionScore' },
          uniqueSources: { $addToSet: '$sourceIP' }
        }
      },
      {
        $project: {
          ip: '$_id',
          count: 1,
          avgSuspicion: { $round: ['$avgSuspicion', 2] },
          uniqueSourceCount: { $size: '$uniqueSources' },
          riskLevel: {
            $switch: {
              branches: [
                { case: { $gte: ['$avgSuspicion', 90] }, then: 'CRITICAL' },
                { case: { $gte: ['$avgSuspicion', 70] }, then: 'HIGH' },
                { case: { $gte: ['$avgSuspicion', 50] }, then: 'MEDIUM' },
              ],
              default: 'LOW'
            }
          }
        }
      },
      { $sort: { avgSuspicion: -1, count: -1 } },
      { $limit: 10 }
    ]);

    // Protocol distribution
    const protocolDistribution = await Log.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$protocol',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          protocol: '$_id',
          count: 1,
          percentage: {
            $round: [
              { $multiply: [{ $divide: ['$count', totalLogs] }, 100] },
              2
            ]
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Top suspicious ports
    const topSuspiciousPorts = await Log.aggregate([
      { $match: { ...filter, suspicionScore: { $gte: 50 } } },
      {
        $group: {
          _id: '$destinationPort',
          count: { $sum: 1 },
          avgSuspicion: { $avg: '$suspicionScore' },
          uniqueSources: { $addToSet: '$sourceIP' }
        }
      },
      {
        $project: {
          port: '$_id',
          count: 1,
          avgSuspicion: { $round: ['$avgSuspicion', 2] },
          uniqueSourceCount: { $size: '$uniqueSources' }
        }
      },
      { $sort: { avgSuspicion: -1, count: -1 } },
      { $limit: 15 }
    ]);

    // Time-based activity analysis
    const hourlyActivity = await Log.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 },
          suspiciousCount: {
            $sum: { $cond: [{ $gte: ['$suspicionScore', 70] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Action distribution
    const actionDistribution = await Log.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          action: '$_id',
          count: 1,
          percentage: {
            $round: [
              { $multiply: [{ $divide: ['$count', totalLogs] }, 100] },
              2
            ]
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Build summary object
    const summary = {
      totalLogs,
      suspiciousActivities,
      criticalThreats,
      suspiciousPercentage: totalLogs > 0 ? ((suspiciousActivities / totalLogs) * 100).toFixed(2) : 0,
      topSourceIPs,
      topDestinationIPs,
      protocolDistribution,
      topSuspiciousPorts,
      hourlyActivity,
      actionDistribution
    };

    // Generate recommendations if requested
    let recommendations = [];
    if (includeRecommendations) {
      recommendations = await generateRecommendations(summary, { startDate, endDate });
    }

    return {
      summary,
      recommendations
    };
  } catch (error) {
    console.error('Report generation error:', error);
    throw error;
  }
}

// Generate security recommendations based on analysis
async function generateRecommendations(summary, { startDate, endDate }) {
  const recommendations = [];

  // Critical threat recommendations
  if (summary.criticalThreats > 0) {
    recommendations.push({
      priority: 'CRITICAL',
      description: `${summary.criticalThreats} critical security threats detected`,
      action: 'Immediate investigation required. Consider blocking suspicious IPs and reviewing security policies.'
    });
  }

  // High suspicious activity recommendations
  if (parseFloat(summary.suspiciousPercentage) > 20) {
    recommendations.push({
      priority: 'HIGH',
      description: `High percentage of suspicious activities (${summary.suspiciousPercentage}%)`,
      action: 'Review firewall rules and implement additional monitoring for flagged traffic patterns.'
    });
  }

  // Top source IP recommendations
  const highRiskSourceIPs = summary.topSourceIPs.filter(ip => 
    ip.riskLevel === 'CRITICAL' || ip.riskLevel === 'HIGH'
  );
  
  if (highRiskSourceIPs.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      description: `${highRiskSourceIPs.length} high-risk source IPs identified`,
      action: `Consider blocking or rate-limiting: ${highRiskSourceIPs.slice(0, 3).map(ip => ip.ip).join(', ')}`
    });
  }

  // Port-based recommendations
  const suspiciousPorts = summary.topSuspiciousPorts.filter(port => port.avgSuspicion > 80);
  if (suspiciousPorts.length > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      description: `High suspicious activity on ports: ${suspiciousPorts.slice(0, 5).map(p => p.port).join(', ')}`,
      action: 'Review port access policies and consider implementing additional controls for these ports.'
    });
  }

  // Time-based recommendations
  const nightActivity = summary.hourlyActivity.filter(h => 
    h._id >= 0 && h._id < 6 && h.suspiciousCount > 0
  );
  
  if (nightActivity.length > 0) {
    const totalNightSuspicious = nightActivity.reduce((sum, h) => sum + h.suspiciousCount, 0);
    if (totalNightSuspicious > summary.suspiciousActivities * 0.3) {
      recommendations.push({
        priority: 'MEDIUM',
        description: 'Significant suspicious activity during off-hours (midnight to 6 AM)',
        action: 'Implement stricter monitoring and access controls during night hours.'
      });
    }
  }

  // Blocked traffic recommendations
  const blockedTraffic = summary.actionDistribution.find(a => 
    a.action === 'BLOCK' || a.action === 'DENY' || a.action === 'DROP'
  );
  
  if (blockedTraffic && parseFloat(blockedTraffic.percentage) > 15) {
    recommendations.push({
      priority: 'MEDIUM',
      description: `High percentage of blocked traffic (${blockedTraffic.percentage}%)`,
      action: 'Review firewall rules to ensure legitimate traffic is not being blocked unnecessarily.'
    });
  }

  // Protocol diversity recommendations
  if (summary.protocolDistribution.length > 6) {
    recommendations.push({
      priority: 'LOW',
      description: 'High protocol diversity detected',
      action: 'Monitor unusual protocol usage and ensure all protocols are necessary for business operations.'
    });
  }

  // General security recommendations
  if (summary.totalLogs > 100000) {
    recommendations.push({
      priority: 'LOW',
      description: 'High volume of network traffic',
      action: 'Consider implementing log rotation and archival policies to manage storage and performance.'
    });
  }

  return recommendations;
}

// Generate executive summary for reports
function generateExecutiveSummary(summary, { startDate, endDate, reportType }) {
  const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const dailyAverage = Math.round(summary.totalLogs / duration);
  
  let executiveSummary = `
## Executive Summary

This ${reportType.toLowerCase()} report covers network security analysis for the period from ${startDate.toDateString()} to ${endDate.toDateString()} (${duration} day${duration > 1 ? 's' : ''}).

### Key Findings:
- **Total Network Events**: ${summary.totalLogs.toLocaleString()} (avg. ${dailyAverage.toLocaleString()}/day)
- **Suspicious Activities**: ${summary.suspiciousActivities.toLocaleString()} (${summary.suspiciousPercentage}% of total traffic)
- **Critical Threats**: ${summary.criticalThreats.toLocaleString()}
- **Risk Level**: ${summary.criticalThreats > 0 ? 'HIGH' : summary.suspiciousActivities > summary.totalLogs * 0.1 ? 'MEDIUM' : 'LOW'}

### Top Concerns:
${summary.topSourceIPs.slice(0, 3).map((ip, index) => 
  `${index + 1}. IP ${ip.ip}: ${ip.count.toLocaleString()} events, ${ip.riskLevel} risk level`
).join('\n')}

### Recommendations:
- Immediate attention required for ${summary.criticalThreats} critical threats
- Review and potentially block ${summary.topSourceIPs.filter(ip => ip.riskLevel === 'HIGH' || ip.riskLevel === 'CRITICAL').length} high-risk IP addresses
- Enhanced monitoring recommended for suspicious port activities
  `;

  return executiveSummary.trim();
}

module.exports = {
  generateReport,
  generateRecommendations,
  generateExecutiveSummary
};
